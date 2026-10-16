import { getSupabaseClient } from '../lib/supabase'
import type { Submission } from '../types'

/**
 * Shape of a `public.inquiries` row restricted to the columns the dashboard
 * actually reads. Column names mirror the existing Supabase schema exactly.
 */
export interface InquiryRow {
  id: string | number
  full_name: string | null
  email: string | null
  phone: string | null
  need: string | null
  project_description: string | null
  budget: string | null
  company: string | null
  preferred_contact: string | null
  status: string | null
  created_at: string | null
  project_reference: string | null
  project_title: string | null
  project_url: string | null
}

export const INQUIRY_TABLE = 'inquiries'

/** Only the columns required by the UI — never `select('*')`. */
export const INQUIRY_COLUMNS = [
  'id',
  'full_name',
  'email',
  'phone',
  'need',
  'project_description',
  'budget',
  'company',
  'preferred_contact',
  'status',
  'created_at',
  'project_reference',
  'project_title',
  'project_url',
].join(',')

export class InquiryDataError extends Error {}

/**
 * Read the status exactly as stored in Supabase so the UI reflects the real
 * database value. Nothing is renamed or mapped to a dashboard-specific label —
 * `pending` stays `pending`, etc. A missing/blank value falls back to a neutral
 * placeholder rather than inventing a status.
 */
export function readInquiryStatus(value: string | null): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : 'Unknown'
}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Map a database row into the dashboard's submission model. */
export function mapInquiryRow(row: InquiryRow): Submission {
  const need = clean(row.need)
  const about = clean(row.project_description)

  return {
    id: String(row.id),
    categoryId: 'inquiries',
    name: clean(row.full_name) ?? 'Unknown',
    phone: clean(row.phone),
    email: clean(row.email),
    summary: need ?? about ?? 'No summary provided',
    status: readInquiryStatus(row.status),
    createdAt: row.created_at ?? new Date().toISOString(),
    fields: [],
    inquiry: {
      need: need ?? '',
      projectId: clean(row.project_reference),
      projectTitle: clean(row.project_title),
      projectUrl: clean(row.project_url),
      budget: clean(row.budget),
      company: clean(row.company),
      contactMethod: clean(row.preferred_contact),
      about: about ?? '',
    },
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
    return 'Access to the inquiries table is restricted by database policies. Please confirm you are signed in as the administrator account that has read access.'
  }

  if (message.includes('failed to fetch') || message.includes('networkerror')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }

  return 'We could not load submissions from the inquiries table. Please try again.'
}

export async function fetchInquiries(): Promise<Submission[]> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(INQUIRY_TABLE)
    .select(INQUIRY_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw new InquiryDataError(describeError(error))
  return ((data ?? []) as unknown as InquiryRow[]).map(mapInquiryRow)
}

export async function fetchInquiryById(
  id: string,
): Promise<Submission | null> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(INQUIRY_TABLE)
    .select(INQUIRY_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new InquiryDataError(describeError(error))
  if (!data) return null
  return mapInquiryRow(data as unknown as InquiryRow)
}
