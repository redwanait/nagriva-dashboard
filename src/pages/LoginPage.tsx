import { useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { brand } from '../config/brand'
import { useAuth } from '../auth/authContext'

interface FieldErrors {
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const validate = (): boolean => {
    const next: FieldErrors = {}
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      next.email = 'Enter your email address.'
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = 'Enter a valid email address.'
    }
    if (!password) {
      next.password = 'Enter your password.'
    }
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'We could not sign you in. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-screen">
      <main className="login-card">
        <div className="login-brand">
          <img className="login-logo" src={brand.logo} alt={brand.name} />
          <span className="login-brand-name">Dashboard</span>
        </div>

        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">
          Access the Nagriva submissions dashboard.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">
              Email address
            </label>
            <div
              className={`login-input-wrap ${fieldErrors.email ? 'has-error' : ''}`}
            >
              <Icon name="mail" size={18} />
              <input
                id="login-email"
                className="login-input"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@nagriva.ma"
                value={email}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? 'login-email-error' : undefined
                }
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {fieldErrors.email && (
              <p className="login-field-error" id="login-email-error">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              Password
            </label>
            <div
              className={`login-input-wrap ${fieldErrors.password ? 'has-error' : ''}`}
            >
              <Icon name="lock" size={18} />
              <input
                id="login-password"
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? 'login-password-error' : undefined
                }
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
            {fieldErrors.password && (
              <p className="login-field-error" id="login-password-error">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {formError && (
            <p className="login-error" role="alert">
              <Icon name="alert" size={16} />
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary login-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="login-foot">
          Administrator access only. Sessions are secured by Supabase Auth.
        </p>
      </main>
    </div>
  )
}
