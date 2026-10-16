import { getSupabaseClient } from '../lib/supabase'
import type { Submission } from '../types'

/**
 * Shape of a `public.call_bookings` row restricted to the columns the dashboard
 * actually reads. Column names mirror the existing Supabase schema exactly.
 */
export interface CallBookingRow {
  id: string | number
  name: string | null
  phone: string | null
  call_method: string | null
  status: string | null
  created_at: string | null
}

export const CALL_BOOKING_TABLE = 'call_bookings'

/** Only the confirmed columns — never `select('*')`. */
export const CALL_BOOKING_COLUMNS = [
  'id',
  'name',
  'phone',
  'call_method',
  'status',
  'created_at',
].join(',')

export class CallBookingDataError extends Error {}

/** Friendly display label for the stored `call_method` value. */
export function callMethodLabel(value: string | null | undefined): string {
  switch (value?.trim().toLowerCase()) {
    case 'whatsapp':
      return 'WhatsApp'
    case 'google-meet':
      return 'Google Meet'
    case 'skype':
      return 'Skype'
    default:
      return ''
  }
}

/**
 * Read the status exactly as stored in Supabase so the UI reflects the real
 * database value (`pending`, `booked`, `done`, `cancelled`). Nothing is renamed
 * or mapped to a dashboard-specific label. A missing/blank value falls back to
 * a neutral placeholder rather than inventing a status.
 */
export function readCallBookingStatus(value: string | null): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : 'Unknown'
}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Map a database row into the dashboard's submission model. */
export function mapCallBookingRow(row: CallBookingRow): Submission {
  const name = clean(row.name)
  const phone = clean(row.phone)
  const method = callMethodLabel(row.call_method)

  return {
    id: String(row.id),
    categoryId: 'call_bookings',
    name: name ?? 'Call booking',
    phone,
    summary: method ? `Free call via ${method}` : 'Free call request',
    status: readCallBookingStatus(row.status),
    createdAt: row.created_at ?? new Date().toISOString(),
    fields: method ? [{ label: 'Call method', value: method }] : [],
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
    return 'Access to the call bookings table is restricted by database policies. Please confirm you are signed in as the administrator account that has read access.'
  }

  if (message.includes('failed to fetch') || message.includes('networkerror')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }

  return 'We could not load submissions from the call bookings table. Please try again.'
}

export async function fetchCallBookings(): Promise<Submission[]> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(CALL_BOOKING_TABLE)
    .select(CALL_BOOKING_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw new CallBookingDataError(describeError(error))
  return ((data ?? []) as unknown as CallBookingRow[]).map(mapCallBookingRow)
}

export async function fetchCallBookingById(
  id: string,
): Promise<Submission | null> {
  const client = getSupabaseClient()

  const { data, error } = await client
    .from(CALL_BOOKING_TABLE)
    .select(CALL_BOOKING_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new CallBookingDataError(describeError(error))
  if (!data) return null
  return mapCallBookingRow(data as unknown as CallBookingRow)
}
