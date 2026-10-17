import { getSupabaseClient } from '../lib/supabase'
import type { Feedback, FeedbackInput, FeedbackStatus } from '../types'

/**
 * Shape of a `public.feedbacks` row restricted to the columns the dashboard
 * actually reads. Column names mirror the existing Supabase schema exactly.
 */
export interface FeedbackRow {
  id: string | number
  author_name: string | null
  author_role: string | null
  author_company: string | null
  author_avatar_url: string | null
  content: string | null
  status: string | null
  created_at: string | null
  published_at: string | null
}

export const FEEDBACK_TABLE = 'feedbacks'

/** Only the confirmed columns — never `select('*')`. */
export const FEEDBACK_COLUMNS = [
  'id',
  'author_name',
  'author_role',
  'author_company',
  'author_avatar_url',
  'content',
  'status',
  'created_at',
  'published_at',
].join(',')

export class FeedbackDataError extends Error {}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Map a database row into the dashboard's feedback model. */
export function mapFeedbackRow(row: FeedbackRow): Feedback {
  return {
    id: String(row.id),
    authorName: clean(row.author_name) ?? 'Unknown',
    authorRole: clean(row.author_role),
    authorCompany: clean(row.author_company),
    authorAvatarUrl: clean(row.author_avatar_url),
    content: clean(row.content) ?? '',
    status: clean(row.status) ?? 'published',
    createdAt: row.created_at ?? new Date().toISOString(),
    publishedAt: clean(row.published_at),
  }
}

interface SupabaseErrorLike {
  message?: string
  code?: string
}

type FeedbackAction = 'load' | 'submit' | 'update' | 'delete'

const RESTRICTED_MESSAGE: Record<FeedbackAction, string> = {
  load: 'Could not load feedback — access is restricted by database policies',
  submit: 'Could not save the feedback — the database rejected the request',
  update: 'Could not update the feedback — the database rejected the request',
  delete: 'Could not delete the feedback — the database rejected the request',
}

const FALLBACK_MESSAGE: Record<FeedbackAction, string> = {
  load: 'Could not load feedback from the feedbacks table. Please try again.',
  submit: 'Could not save the feedback',
  update: 'Could not update the feedback',
  delete: 'Could not delete the feedback',
}

/** Turn a Supabase/network error into a concise, accurate user-facing message. */
function describeError(error: SupabaseErrorLike, action: FeedbackAction): string {
  const rawMessage = error.message ?? ''
  const message = rawMessage.toLowerCase()
  const code = error.code ?? ''
  const detail = `${code || 'unknown'}: ${rawMessage || 'no message'}`

  if (
    code === '42501' ||
    code === 'PGRST301' ||
    message.includes('permission denied') ||
    message.includes('row-level security') ||
    message.includes('jwt') ||
    message.includes('invalid api key') ||
    message.includes('no api key')
  ) {
    return `${RESTRICTED_MESSAGE[action]} (${detail}).`
  }

  if (message.includes('failed to fetch') || message.includes('networkerror')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }

  return action === 'load'
    ? FALLBACK_MESSAGE[action]
    : `${FALLBACK_MESSAGE[action]} (${detail}).`
}

/**
 * Read every feedback entry ordered by creation date so the administrator can
 * moderate the full list (pending, published, and rejected). Access is limited
 * to the administrator by RLS; ordinary visitors only ever see published rows.
 * `published_at` is nullable and is intentionally never used for
 * ordering/filtering: the website's implementation documents a `timestamptz`
 * cast error (22007) when a published record has a NULL `published_at`.
 */
export async function fetchFeedbacks(): Promise<Feedback[]> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(FEEDBACK_TABLE)
    .select(FEEDBACK_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw new FeedbackDataError(describeError(error, 'load'))
  return ((data ?? []) as unknown as FeedbackRow[]).map(mapFeedbackRow)
}

/** Columns written when creating or editing a feedback. */
function toRow(input: FeedbackInput, publishedAt: string | null) {
  return {
    author_name: input.authorName,
    author_role: input.authorRole || null,
    author_company: input.authorCompany || null,
    author_avatar_url: input.authorAvatarUrl || null,
    content: input.content,
    status: input.status,
    published_at: publishedAt,
  }
}

/**
 * Timestamp to persist for a given status.
 *   * publishing sets `published_at` only when it is not already set,
 *   * leaving it published preserves the existing publication timestamp,
 *   * moving away from published clears it.
 */
function resolvePublishedAt(
  status: FeedbackStatus,
  currentPublishedAt?: string | null,
): string | null {
  if (status !== 'published') return null
  return currentPublishedAt ?? new Date().toISOString()
}

/**
 * Insert a new feedback with the status selected by the user. A `published`
 * record gets `published_at` set to now so it appears on the website
 * immediately; a `pending` record gets `published_at = null` and waits for
 * review. Authorization is enforced by RLS; the website's public submissions
 * remain `pending`. `id` and `created_at` are omitted so the database applies
 * its defaults.
 */
export async function insertFeedback(input: FeedbackInput): Promise<void> {
  const client = getSupabaseClient()

  const { error } = await client
    .from(FEEDBACK_TABLE)
    .insert(toRow(input, resolvePublishedAt(input.status)))

  if (error) throw new FeedbackDataError(describeError(error, 'submit'))
}

/**
 * Update an existing feedback in place by its id — never inserts a new row.
 * `currentPublishedAt` is the record's current `published_at` value, used to
 * preserve the original publication timestamp when it stays published.
 */
export async function updateFeedback(
  id: string,
  input: FeedbackInput,
  currentPublishedAt?: string | null,
): Promise<void> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(FEEDBACK_TABLE)
    .update(toRow(input, resolvePublishedAt(input.status, currentPublishedAt)))
    .eq('id', id)
    .select('id')

  if (error) throw new FeedbackDataError(describeError(error, 'update'))
  if (!data || data.length === 0) {
    throw new FeedbackDataError(
      'This feedback could not be found, or you are not allowed to edit it.',
    )
  }
}

/** Delete a single feedback by its id. */
export async function deleteFeedback(id: string): Promise<void> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(FEEDBACK_TABLE)
    .delete()
    .eq('id', id)
    .select('id')

  if (error) throw new FeedbackDataError(describeError(error, 'delete'))
  if (!data || data.length === 0) {
    throw new FeedbackDataError(
      'This feedback could not be found, or you are not allowed to delete it.',
    )
  }
}
