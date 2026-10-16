import { useCallback, useMemo, useState } from 'react'
import { Layout } from './components/Layout'
import { AppLoadingScreen } from './components/AppLoadingScreen'
import { ConfigErrorScreen } from './components/ConfigErrorScreen'
import { AuthProvider } from './auth/AuthProvider'
import { useAuth } from './auth/authContext'
import { RouterContext } from './router'
import type { RouterValue } from './router'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { SubmissionsPage } from './pages/SubmissionsPage'
import { SubmissionsInboxPage } from './pages/SubmissionsInboxPage'
import { SubmissionDetailsPage } from './pages/SubmissionDetailsPage'
import { FeedbacksPage } from './pages/FeedbacksPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { SettingsPage } from './pages/SettingsPage'
import { isSupabaseConfigured, SUPABASE_CONFIG_ERROR } from './lib/supabase'
import type { Route } from './types'

function Dashboard() {
  const [route, setRoute] = useState<Route>({ page: 'overview' })

  const navigate = useCallback((next: Route) => {
    setRoute(next)
    window.scrollTo({ top: 0 })
  }, [])

  const router = useMemo<RouterValue>(
    () => ({ route, navigate }),
    [route, navigate],
  )

  const page = (() => {
    switch (route.page) {
      case 'overview':
        return <OverviewPage />
      case 'submissions':
        return <SubmissionsPage />
      case 'submissions-inbox':
        return (
          <SubmissionsInboxPage
            key={route.categoryId}
            categoryId={route.categoryId}
          />
        )
      case 'details':
        return (
          <SubmissionDetailsPage
            key={`${route.categoryId}-${route.submissionId}`}
            categoryId={route.categoryId}
            submissionId={route.submissionId}
          />
        )
      case 'feedbacks':
        return <FeedbacksPage />
      case 'notifications':
        return <NotificationsPage />
      case 'settings':
        return <SettingsPage />
    }
  })()

  return (
    <RouterContext.Provider value={router}>
      <Layout>{page}</Layout>
    </RouterContext.Provider>
  )
}

/**
 * Renders the dashboard only when Supabase Auth reports an active session.
 * The session is restored from storage on refresh and kept in sync through
 * `onAuthStateChange`. No client-side email check is used as authorization —
 * Row Level Security on the database is the source of truth for data access.
 */
function AuthenticatedApp() {
  const { session, loading } = useAuth()

  if (loading) {
    return <AppLoadingScreen />
  }

  if (!session) {
    return <LoginPage />
  }

  return <Dashboard />
}

function App() {
  if (!isSupabaseConfigured) {
    return (
      <ConfigErrorScreen
        message={
          SUPABASE_CONFIG_ERROR ??
          'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
        }
      />
    )
  }

  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}

export default App
