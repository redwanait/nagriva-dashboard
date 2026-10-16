import { useCallback, useEffect, useState } from 'react'
import { fetchCallBookings } from '../data/callBookings'
import { useAuth } from '../auth/authContext'
import type { Submission } from '../types'

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error'
}

export function useCallBookings() {
  const { session } = useAuth()
  const userId = session?.user.id ?? null

  const [data, setData] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // Never query Supabase without an authenticated session. RLS is enforced
    // server-side, but we also avoid issuing the request at all.
    if (!userId) return

    let active = true

    fetchCallBookings()
      .then((result) => {
        if (!active) return
        setData(result)
        setError(null)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!active) return
        setData([])
        setError(toMessage(err))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [reloadKey, userId])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  return { data, loading, error, reload }
}
