import { useState } from 'react'
import { Card } from '../components/Card'
import { Icon, WhatsAppIcon } from '../components/Icon'
import { StatusBadge } from '../components/StatusBadge'
import { getCategory, getSubmission } from '../data/submissions'
import { useRouter } from '../router'
import { formatDateTime } from '../utils/date'
import { SUBMISSION_STATUSES } from '../types'
import type { Note, SubmissionCategoryId } from '../types'

interface MockSubmissionDetailsPageProps {
  categoryId?: SubmissionCategoryId
  submissionId?: string
}

/**
 * Details view for the mock-data categories (Find Your Project and
 * Book a Free Call). Start with Nagriva uses the Supabase-backed page instead.
 */
export function MockSubmissionDetailsPage({
  categoryId,
  submissionId,
}: MockSubmissionDetailsPageProps) {
  const { navigate } = useRouter()
  const submission = getSubmission(categoryId, submissionId)
  const category = categoryId ? getCategory(categoryId) : undefined

  const [status, setStatus] = useState<string>(
    submission?.status ?? 'New',
  )
  const [notes, setNotes] = useState<Note[]>(submission?.notes ?? [])
  const [noteDraft, setNoteDraft] = useState('')

  const goBack = () => {
    if (categoryId) {
      navigate({ page: 'submissions-inbox', categoryId })
    } else {
      navigate({ page: 'submissions' })
    }
  }

  if (!submission) {
    return (
      <Card className="empty-state">
        <Icon name="inbox" size={26} />
        <p className="empty-title">Submission not found</p>
        <button
          type="button"
          className="button button-secondary"
          onClick={goBack}
        >
          Back to submissions
        </button>
      </Card>
    )
  }

  const initials = submission.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  const waNumber = submission.phone?.replace(/[^\d]/g, '')

  const addNote = () => {
    const text = noteDraft.trim()
    if (!text) return
    setNotes((current) => [
      ...current,
      { id: `n-${Date.now()}`, text, createdAt: new Date().toISOString() },
    ])
    setNoteDraft('')
  }

  return (
    <>
      <button type="button" className="back-button" onClick={goBack}>
        <Icon name="arrow-left" size={18} />
        {category?.label ?? 'Submissions'}
      </button>

      <div className="details-header">
        <div className="details-identity">
          <span className="details-avatar">{initials}</span>
          <div>
            <h1 className="page-title">{submission.name}</h1>
            <p className="page-subtitle">{category?.label ?? 'Submission'}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {(submission.phone || submission.email) && (
        <div className="details-actions">
          {submission.phone && waNumber && (
            <a
              className="button button-whatsapp"
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} />
              WhatsApp
            </a>
          )}
          {submission.email && (
            <a
              className="button button-secondary"
              href={`mailto:${submission.email}`}
            >
              <Icon name="mail" size={18} />
              Email
            </a>
          )}
        </div>
      )}

      <div className="details-grid">
        <Card className="details-card">
          <h2 className="card-title">Client contact</h2>
          <dl className="detail-list">
            {submission.phone && (
              <div className="detail-row">
                <dt>Phone</dt>
                <dd>{submission.phone}</dd>
              </div>
            )}
            {submission.email && (
              <div className="detail-row">
                <dt>Email</dt>
                <dd>{submission.email}</dd>
              </div>
            )}
            <div className="detail-row">
              <dt>Received</dt>
              <dd>{formatDateTime(submission.createdAt)}</dd>
            </div>
            {category && (
              <div className="detail-row">
                <dt>Source</dt>
                <dd>{category.table}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="details-card">
          <h2 className="card-title">Original request</h2>
          <div className="request-list">
            {submission.fields.map((field) => (
              <div key={field.label} className="request-field">
                <span className="request-label">{field.label}</span>
                <span className="request-value">{field.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="details-card">
        <h2 className="card-title">Status</h2>
        <div className="status-options">
          {SUBMISSION_STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              className={`chip ${status === option ? 'is-active' : ''}`}
              onClick={() => setStatus(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </Card>

      <Card className="details-card">
        <h2 className="card-title">Private notes</h2>
        <p className="card-hint">Only visible to your team.</p>

        {notes.length > 0 && (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="note-item">
                <p className="note-text">{note.text}</p>
                <span className="note-time">
                  {formatDateTime(note.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="note-composer">
          <textarea
            className="textarea"
            value={noteDraft}
            placeholder="Add a private note…"
            rows={3}
            onChange={(event) => setNoteDraft(event.target.value)}
          />
          <button
            type="button"
            className="button button-primary"
            onClick={addNote}
            disabled={noteDraft.trim().length === 0}
          >
            Add note
          </button>
        </div>
      </Card>
    </>
  )
}
