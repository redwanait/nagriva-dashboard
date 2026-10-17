import { useMemo, useState } from 'react'
import { PageHeader } from '../components/Card'
import { FeedbackCard } from '../components/FeedbackCard'
import { FeedbackForm } from '../components/FeedbackForm'
import { Icon } from '../components/Icon'
import { SearchInput } from '../components/SearchInput'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { useFeedbacks } from '../hooks/useFeedbacks'
import { FEEDBACK_STATUSES } from '../types'
import type { Feedback, FeedbackInput, FeedbackStatus } from '../types'

type FormMode = 'create' | 'edit'

interface Notice {
  type: 'success' | 'error'
  message: string
}

/** Coerce a stored status string into one the form can edit safely. */
function toEditableStatus(value: string): FeedbackStatus {
  const normalized = value.trim().toLowerCase()
  return (FEEDBACK_STATUSES as readonly string[]).includes(normalized)
    ? (normalized as FeedbackStatus)
    : 'pending'
}

export function FeedbacksPage() {
  const {
    data,
    loading,
    error,
    reload,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  } = useFeedbacks()
  const [formMode, setFormMode] = useState<FormMode | null>(null)
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return data
    return data.filter((feedback) => {
      return (
        feedback.authorName.toLowerCase().includes(term) ||
        (feedback.authorRole?.toLowerCase().includes(term) ?? false) ||
        (feedback.authorCompany?.toLowerCase().includes(term) ?? false) ||
        feedback.content.toLowerCase().includes(term)
      )
    })
  }, [data, query])

  const closeForm = () => {
    setFormMode(null)
    setEditingFeedback(null)
  }

  const openCreateForm = () => {
    setEditingFeedback(null)
    setFormMode((mode) => (mode === 'create' ? null : 'create'))
    setNotice(null)
  }

  const openEditForm = (feedback: Feedback) => {
    setEditingFeedback(feedback)
    setFormMode('edit')
    setNotice(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (input: FeedbackInput) => {
    if (formMode === 'edit' && editingFeedback) {
      await updateFeedback(
        editingFeedback.id,
        input,
        editingFeedback.publishedAt ?? null,
      )
      return
    }
    await createFeedback(input)
  }

  const handleSubmitted = (status: FeedbackStatus) => {
    const wasEditing = formMode === 'edit'
    closeForm()
    setNotice({
      type: 'success',
      message: wasEditing
        ? 'Feedback updated successfully.'
        : status === 'published'
          ? 'Feedback published. It now appears on the Nagriva website.'
          : `Feedback saved as ${status}. It will appear on the website once it is published.`,
    })
    reload()
  }

  const handleDelete = async (feedback: Feedback) => {
    await deleteFeedback(feedback.id)
    setNotice({
      type: 'success',
      message: `Feedback from ${feedback.authorName} was deleted.`,
    })
    reload()
  }

  const initialValues: FeedbackInput | undefined =
    formMode === 'edit' && editingFeedback
      ? {
          authorName: editingFeedback.authorName,
          authorRole: editingFeedback.authorRole,
          authorCompany: editingFeedback.authorCompany,
          authorAvatarUrl: editingFeedback.authorAvatarUrl,
          content: editingFeedback.content,
          status: toEditableStatus(editingFeedback.status),
        }
      : undefined

  return (
    <>
      <PageHeader
        className="page-header-feedback"
        title="Feedbacks"
        subtitle="Moderate client feedback for the website. Publish, edit, or remove entries."
        action={
          <button
            type="button"
            className="button button-primary"
            onClick={openCreateForm}
          >
            <Icon name={formMode === 'create' ? 'arrow-left' : 'plus'} size={18} />
            {formMode === 'create' ? 'Close form' : 'Add Feedback'}
          </button>
        }
      />

      {notice && (
        <div
          className={`feedback-notice feedback-notice-${notice.type}`}
          role={notice.type === 'error' ? 'alert' : 'status'}
        >
          <Icon name={notice.type === 'error' ? 'alert' : 'check'} size={16} />
          <span>{notice.message}</span>
          <button
            type="button"
            className="feedback-notice-dismiss"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {formMode && (
        <FeedbackForm
          key={formMode === 'edit' && editingFeedback ? editingFeedback.id : 'create'}
          mode={formMode}
          initialValues={initialValues}
          onCancel={closeForm}
          onSubmitted={handleSubmitted}
          onSubmit={handleSubmit}
        />
      )}

      <div className="submissions-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, role, company, or content"
        />
      </div>

      {loading ? (
        <LoadingState label="Loading feedback…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : results.length === 0 ? (
        <EmptyState
          icon="message"
          title={
            data.length === 0
              ? 'No feedback yet'
              : 'No feedback matches your search'
          }
          description={
            data.length === 0
              ? 'Add feedback with the button above, or wait for it to arrive from the website.'
              : 'Try a different name, company, role, or keyword.'
          }
        />
      ) : (
        <div className="feedback-list">
          {results.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  )
}
