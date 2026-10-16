import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from './Card'
import { Icon } from './Icon'
import type { FeedbackInput, FeedbackStatus } from '../types'

const NAME_MAX = 80
const ROLE_MAX = 80
const COMPANY_MAX = 80
const AVATAR_MAX = 500
const CONTENT_MAX = 1000

interface FieldErrors {
  authorName?: string
  authorRole?: string
  authorCompany?: string
  authorAvatarUrl?: string
  content?: string
  status?: string
}

interface FeedbackFormProps {
  onCancel: () => void
  onSubmitted: (status: FeedbackStatus) => void
  createFeedback: (input: FeedbackInput) => Promise<void>
}

export function FeedbackForm({
  onCancel,
  onSubmitted,
  createFeedback,
}: FeedbackFormProps) {
  const [authorName, setAuthorName] = useState('')
  const [authorRole, setAuthorRole] = useState('')
  const [authorCompany, setAuthorCompany] = useState('')
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<FeedbackStatus>('published')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const validate = (): boolean => {
    const next: FieldErrors = {}
    const name = authorName.trim()
    const text = content.trim()

    if (!name) {
      next.authorName = 'Enter the customer name.'
    } else if (name.length > NAME_MAX) {
      next.authorName = `Name must be ${NAME_MAX} characters or fewer.`
    }

    if (!text) {
      next.content = 'Enter the feedback content.'
    } else if (text.length > CONTENT_MAX) {
      next.content = `Feedback must be ${CONTENT_MAX} characters or fewer.`
    }

    if (authorRole.trim().length > ROLE_MAX) {
      next.authorRole = `Role must be ${ROLE_MAX} characters or fewer.`
    }
    if (authorCompany.trim().length > COMPANY_MAX) {
      next.authorCompany = `Company must be ${COMPANY_MAX} characters or fewer.`
    }
    if (authorAvatarUrl.trim().length > AVATAR_MAX) {
      next.authorAvatarUrl = `Avatar URL must be ${AVATAR_MAX} characters or fewer.`
    }
    if (status !== 'pending' && status !== 'published') {
      next.status = 'Select a status.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      await createFeedback({
        authorName: authorName.trim(),
        authorRole: authorRole.trim() || undefined,
        authorCompany: authorCompany.trim() || undefined,
        authorAvatarUrl: authorAvatarUrl.trim() || undefined,
        content: content.trim(),
        status,
      })
      onSubmitted(status)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'We could not save the feedback. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="feedback-form-card">
      <h2 className="card-title">Add feedback</h2>
      <p className="card-hint">
        Published feedback appears on the website immediately. Pending feedback
        waits for review.
      </p>

      <form className="feedback-form" onSubmit={handleSubmit} noValidate>
        <div className="feedback-form-grid">
          <label className="field">
            <span className="field-label">Customer name *</span>
            <input
              className="input"
              type="text"
              value={authorName}
              maxLength={NAME_MAX}
              placeholder="e.g. Yassine El Amrani"
              disabled={submitting}
              aria-invalid={Boolean(errors.authorName)}
              onChange={(event) => setAuthorName(event.target.value)}
            />
            {errors.authorName && (
              <span className="field-error">{errors.authorName}</span>
            )}
          </label>

          <label className="field">
            <span className="field-label">Role (optional)</span>
            <input
              className="input"
              type="text"
              value={authorRole}
              maxLength={ROLE_MAX}
              placeholder="e.g. Founder"
              disabled={submitting}
              aria-invalid={Boolean(errors.authorRole)}
              onChange={(event) => setAuthorRole(event.target.value)}
            />
            {errors.authorRole && (
              <span className="field-error">{errors.authorRole}</span>
            )}
          </label>

          <label className="field">
            <span className="field-label">Company or project (optional)</span>
            <input
              className="input"
              type="text"
              value={authorCompany}
              maxLength={COMPANY_MAX}
              placeholder="e.g. El Amrani Textiles"
              disabled={submitting}
              aria-invalid={Boolean(errors.authorCompany)}
              onChange={(event) => setAuthorCompany(event.target.value)}
            />
            {errors.authorCompany && (
              <span className="field-error">{errors.authorCompany}</span>
            )}
          </label>

          <label className="field">
            <span className="field-label">Avatar URL (optional)</span>
            <input
              className="input"
              type="url"
              value={authorAvatarUrl}
              maxLength={AVATAR_MAX}
              placeholder="https://…"
              disabled={submitting}
              aria-invalid={Boolean(errors.authorAvatarUrl)}
              onChange={(event) => setAuthorAvatarUrl(event.target.value)}
            />
            {errors.authorAvatarUrl && (
              <span className="field-error">{errors.authorAvatarUrl}</span>
            )}
          </label>

          <label className="field">
            <span className="field-label">Status *</span>
            <select
              className="input"
              value={status}
              disabled={submitting}
              aria-invalid={Boolean(errors.status)}
              onChange={(event) =>
                setStatus(event.target.value as FeedbackStatus)
              }
            >
              <option value="published">Published</option>
              <option value="pending">Pending</option>
            </select>
            {errors.status && (
              <span className="field-error">{errors.status}</span>
            )}
          </label>
        </div>

        <label className="field">
          <span className="field-label">Feedback content *</span>
          <textarea
            className="textarea"
            value={content}
            maxLength={CONTENT_MAX}
            rows={4}
            placeholder="Share what the customer said about working with Nagriva…"
            disabled={submitting}
            aria-invalid={Boolean(errors.content)}
            onChange={(event) => setContent(event.target.value)}
          />
          <span className="feedback-counter">
            {content.length}/{CONTENT_MAX}
          </span>
          {errors.content && (
            <span className="field-error">{errors.content}</span>
          )}
        </label>

        {formError && (
          <p className="login-error" role="alert">
            <Icon name="alert" size={16} />
            {formError}
          </p>
        )}

        <div className="feedback-form-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button button-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Saving…
              </>
            ) : (
              'Save feedback'
            )}
          </button>
        </div>
      </form>
    </Card>
  )
}
