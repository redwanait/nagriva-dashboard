import { useCallback, useEffect, useState } from 'react'
import { fetchInquiryById } from '../data/inquiries'
import { useAuth } from '../auth/authContext'
import type { Submission } from '../types'

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error'
}

/** Fetch a single inquiry by its stable record id (never by array index). */
export function useInquiry(id: string | undefined) {
  const { session } = useAuth()
  const userId = session?.user.id ?? null

  const [data, setData] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // Never query Supabase without an authenticated session.
    if (!userId) return

    let active = true

    const request: Promise<Submission | null> = id
      ? fetchInquiryById(id)
      : Promise.reject(new Error('Missing submission id.'))

    request
      .then((result) => {
        if (!active) return
        setData(result)
        setError(null)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setData(null)
        setError(toMessage(err))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, reloadKey, userId])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  return { data, loading, error, reload }
}
