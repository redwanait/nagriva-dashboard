import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext'
import type { AuthContextValue } from './authContext'

interface AuthErrorLike {
  message?: string
  status?: number
}

/** Turn a Supabase auth error into a safe, user-facing message. */
function describeAuthError(error: AuthErrorLike): string {
  const message = (error.message ?? '').toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (message.includes('email not confirmed')) {
    return 'This account has not been confirmed yet. Please confirm it first.'
  }
  if (message.includes('too many requests') || error.status === 429) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'Could not reach Supabase. Check your connection and try again.'
  }
  return 'We could not sign you in. Please try again.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  // Resolve the initial session before rendering anything protected.
  const [loading, setLoading] = useState(() => supabase !== null)

  useEffect(() => {
    if (!supabase) return

    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setSession(data.session)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setSession(null)
        setLoading(false)
      })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase is not configured.')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(describeAuthError(error))
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ session, loading, signIn, signOut }),
    [session, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
