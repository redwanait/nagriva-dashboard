import { getSupabaseClient } from '../lib/supabase'
import type { Submission } from '../types'

/**
 * Shape of a `public.project_inquiries` row restricted to the columns the
 * dashboard actually reads. Column names mirror the existing Supabase schema
 * exactly. This table is intentionally different from `public.inquiries`: it
 * only stores the "Find Your Project" website form fields.
 */
export interface ProjectInquiryRow {
  id: string | number
  description: string | null
  whatsapp: string | null
  status: string | null
  created_at: string | null
}

export const PROJECT_INQUIRY_TABLE = 'project_inquiries'

/** Only the confirmed columns — never `select('*')`. */
export const PROJECT_INQUIRY_COLUMNS = [
  'id',
  'description',
  'whatsapp',
  'status',
  'created_at',
].join(',')

export class ProjectInquiryDataError extends Error {}

/**
 * Read the status exactly as stored in Supabase so the UI reflects the real
 * database value (`pending`, `contacted`, `done`, `cancelled`). Nothing is
 * renamed or mapped to a dashboard-specific label. A missing/blank value falls
 * back to a neutral placeholder rather than inventing a status.
 */
export function readProjectInquiryStatus(value: string | null): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : 'Unknown'
}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Map a database row into the dashboard's submission model. */
export function mapProjectInquiryRow(row: ProjectInquiryRow): Submission {
  const description = clean(row.description)
  const whatsapp = clean(row.whatsapp)

  return {
    id: String(row.id),
    categoryId: 'project_inquiries',
    // The table stores no name or email; use a neutral label instead of
    // fabricating contact details.
    name: 'Project inquiry',
    phone: whatsapp,
    summary: description ?? 'No summary provided',
    status: readProjectInquiryStatus(row.status),
    createdAt: row.created_at ?? new Date().toISOString(),
    fields: [],
    notes: [],
  }
}

interface SupabaseErrorLike {
  message?: string
  code?: string
}

/** Turn a Supabase/network error into a safe, user-facing message. */
function describeError(error: SupabaseErrorLike): string {
  const message = (error.message ?? '').toLowerCase()
  const code = error.code ?? ''

  if (
    code === '42501' ||
    code === 'PGRST301' ||
    message.includes('permission denied') ||
    message.includes('row-level security') ||
    message.includes('jwt') ||
    message.includes('invalid api key') ||
    message.includes('no api key')
  ) {
    return 'Access to the project inquiries table is restricted by database policies. Please confirm you are signed in as the administrator account that has read access.'
  }

  if (message.includes('failed to fetch') || message.includes('networkerror')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }

  return 'We could not load submissions from the project inquiries table. Please try again.'
}

export async function fetchProjectInquiries(): Promise<Submission[]> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(PROJECT_INQUIRY_TABLE)
    .select(PROJECT_INQUIRY_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw new ProjectInquiryDataError(describeError(error))
  return ((data ?? []) as unknown as ProjectInquiryRow[]).map(
    mapProjectInquiryRow,
  )
}

export async function fetchProjectInquiryById(
  id: string,
): Promise<Submission | null> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(PROJECT_INQUIRY_TABLE)
    .select(PROJECT_INQUIRY_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new ProjectInquiryDataError(describeError(error))
  if (!data) return null
  return mapProjectInquiryRow(data as unknown as ProjectInquiryRow)
}
