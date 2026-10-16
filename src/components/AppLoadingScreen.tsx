import { brand } from '../config/brand'

/**
 * Full-screen loading state shown while the initial Supabase session is being
 * resolved. Prevents protected content from flashing before auth is confirmed.
 */
export function AppLoadingScreen() {
  return (
    <div className="auth-loading">
      <img
        className="auth-loading-logo"
        src={brand.symbol}
        alt={brand.name}
      />
      <span className="spinner" aria-hidden="true" />
      <p className="auth-loading-label">Checking your session…</p>
    </div>
  )
}
