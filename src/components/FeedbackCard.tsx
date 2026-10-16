import { Avatar } from './Avatar'
import { Card } from './Card'
import { Icon } from './Icon'
import { StatusBadge } from './StatusBadge'
import { formatDate } from '../utils/date'
import type { Feedback } from '../types'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

interface FeedbackCardProps {
  feedback: Feedback
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const roleLine =
    [feedback.authorRole, feedback.authorCompany].filter(Boolean).join(' · ') ||
    'Client'
  const dateValue = feedback.publishedAt ?? feedback.createdAt

  return (
    <Card className="feedback-card">
      <div className="feedback-card-head">
        <Avatar
          src={feedback.authorAvatarUrl}
          alt={`${feedback.authorName}'s photo`}
          initials={getInitials(feedback.authorName)}
          size={44}
        />
        <div className="feedback-identity">
          <span className="feedback-name">{feedback.authorName}</span>
          <span className="feedback-role">{roleLine}</span>
        </div>
        <StatusBadge status="Published" />
      </div>

      <p className="feedback-content">{feedback.content}</p>

      <div className="feedback-meta">
        <span className="meta-item">
          <Icon name="calendar" size={15} />
          {formatDate(dateValue)}
        </span>
      </div>
    </Card>
  )
}
