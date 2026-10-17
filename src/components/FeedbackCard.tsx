import { useState } from 'react'
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

function statusLabel(status: string): string {
  const trimmed = status.trim()
  if (!trimmed) return 'Unknown'
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

interface FeedbackCardProps {
  feedback: Feedback
  onEdit: (feedback: Feedback) => void
  onDelete: (feedback: Feedback) => Promise<void>
}

export function FeedbackCard({
  feedback,
  onEdit,
  onDelete,
}: FeedbackCardProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const roleLine =
    [feedback.authorRole, feedback.authorCompany].filter(Boolean).join(' · ') ||
    'Client'
  const dateValue = feedback.publishedAt ?? feedback.createdAt

  const handleConfirmDelete = async () => {
    if (deleting) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(feedback)
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'We could not delete the feedback. Please try again.',
      )
      setDeleting(false)
    }
  }

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
        <StatusBadge status={statusLabel(feedback.status)} />
      </div>

      <p className="feedback-content">{feedback.content}</p>

      <div className="feedback-meta">
        <span className="meta-item">
          <Icon name="calendar" size={15} />
          {formatDate(dateValue)}
        </span>

        <div className="feedback-actions">
          <button
            type="button"
            className="button button-secondary button-sm"
            onClick={() => onEdit(feedback)}
            disabled={deleting}
          >
            Edit
          </button>
          <button
            type="button"
            className="button button-danger button-sm"
            onClick={() => {
              setDeleteError(null)
              setConfirming(true)
            }}
            disabled={deleting || confirming}
          >
            Delete
          </button>
        </div>
      </div>

      {confirming && (
        <div
          className="feedback-confirm"
          role="alertdialog"
          aria-label={`Delete feedback from ${feedback.authorName}`}
        >
          <p className="feedback-confirm-text">
            Delete feedback from <strong>{feedback.authorName}</strong>? This
            cannot be undone.
          </p>
          <div className="feedback-confirm-actions">
            <button
              type="button"
              className="button button-secondary button-sm"
              onClick={() => setConfirming(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button-danger button-sm"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true" />
                  Deleting…
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
          {deleteError && (
            <p className="field-error" role="alert">
              {deleteError}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
