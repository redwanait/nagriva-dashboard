import { brand } from '../config/brand'

interface ConfigErrorScreenProps {
  message: string
}

/**
 * Shown when Supabase configuration is missing, placeholder, or unsafe. We fail
 * loudly instead of silently falling back to mock data.
 */
export function ConfigErrorScreen({ message }: ConfigErrorScreenProps) {
  return (
    <div className="login-screen">
      <main className="login-card login-card-error">
        <div className="login-brand">
          <img className="login-logo" src={brand.logo} alt={brand.name} />
        </div>

        <h1 className="login-title">Configuration required</h1>
        <p className="login-subtitle">{message}</p>

        <div className="config-hint">
          <p>Create a `.env.local` file in the project root with:</p>
          <pre className="config-code">
{`VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>`}
          </pre>
          <p>
            Use the publishable / anon key only — never an `sb_secret_` or
            service-role key. Restart the dev server after changing it.
          </p>
        </div>
      </main>
    </div>
  )
}
