import { getSupabaseClient } from '../lib/supabase'
import type { Feedback, FeedbackInput } from '../types'

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

/** Turn a Supabase/network error into a concise, accurate user-facing message. */
function describeError(
  error: SupabaseErrorLike,
  action: 'load' | 'submit',
): string {
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
    return action === 'submit'
      ? `Could not save the feedback — the database rejected the request (${detail}).`
      : `Could not load feedback — access is restricted by database policies (${detail}).`
  }

  if (message.includes('failed to fetch') || message.includes('networkerror')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }

  return action === 'submit'
    ? `Could not save the feedback (${detail}).`
    : 'Could not load published feedback from the feedbacks table. Please try again.'
}

/**
 * Read published feedback ordered by creation date. `published_at` is nullable
 * and is intentionally never used for ordering/filtering: the website's
 * implementation documents a `timestamptz` cast error (22007) when a published
 * record has a NULL `published_at`.
 */
export async function fetchPublishedFeedbacks(): Promise<Feedback[]> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(FEEDBACK_TABLE)
    .select(FEEDBACK_COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) throw new FeedbackDataError(describeError(error, 'load'))
  return ((data ?? []) as unknown as FeedbackRow[]).map(mapFeedbackRow)
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
  const isPublished = input.status === 'published'

  const { error } = await client.from(FEEDBACK_TABLE).insert({
    author_name: input.authorName,
    author_role: input.authorRole || null,
    author_company: input.authorCompany || null,
    author_avatar_url: input.authorAvatarUrl || null,
    content: input.content,
    status: input.status,
    published_at: isPublished ? new Date().toISOString() : null,
  })

  if (error) throw new FeedbackDataError(describeError(error, 'submit'))
}
