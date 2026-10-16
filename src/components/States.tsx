import { Card } from './Card'
import { Icon, type IconName } from './Icon'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: IconName
}

export function EmptyState({
  title,
  description,
  icon = 'inbox',
}: EmptyStateProps) {
  return (
    <Card className="state">
      <span className="state-badge">
        <Icon name={icon} size={22} />
      </span>
      <p className="state-title">{title}</p>
      {description && <p className="state-desc">{description}</p>}
    </Card>
  )
}

export function LoadingState({ label = 'Loading submissions…' }: { label?: string }) {
  return (
    <Card className="state">
      <span className="spinner" aria-hidden="true" />
      <p className="state-label">{label}</p>
    </Card>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="state state-error">
      <span className="state-badge">
        <Icon name="alert" size={22} />
      </span>
      <p className="state-title">Couldn't load submissions</p>
      <p className="state-desc">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="button button-secondary"
          onClick={onRetry}
        >
          <Icon name="refresh" size={16} />
          Try again
        </button>
      )}
    </Card>
  )
}
