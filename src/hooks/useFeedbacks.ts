import { useCallback, useEffect, useState } from 'react'
import {
  deleteFeedback as deleteFeedbackRecord,
  fetchFeedbacks,
  insertFeedback,
  updateFeedback as updateFeedbackRecord,
} from '../data/feedbacks'
import { useAuth } from '../auth/authContext'
import type { Feedback, FeedbackInput } from '../types'

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error'
}

export function useFeedbacks() {
  const { session } = useAuth()
  const userId = session?.user.id ?? null

  const [data, setData] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // Never query Supabase without an authenticated session. RLS is enforced
    // server-side, but we also avoid issuing the request at all.
    if (!userId) return

    let active = true

    fetchFeedbacks()
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

  /**
   * Create a feedback. Inserted as `published` by the data layer (admin only,
   * enforced by RLS). The returned promise rejects with a safe message that
   * preserves the original Supabase code so the caller can surface it.
   */
  const createFeedback = useCallback(async (input: FeedbackInput) => {
    await insertFeedback(input)
  }, [])

  /** Update an existing feedback by id (never creates a duplicate). */
  const updateFeedback = useCallback(
    async (
      id: string,
      input: FeedbackInput,
      currentPublishedAt?: string | null,
    ) => {
      await updateFeedbackRecord(id, input, currentPublishedAt)
    },
    [],
  )

  /** Delete a single feedback by id. */
  const deleteFeedback = useCallback(async (id: string) => {
    await deleteFeedbackRecord(id)
  }, [])

  return {
    data,
    loading,
    error,
    reload,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  }
}
