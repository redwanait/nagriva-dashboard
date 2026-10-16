import { useMemo, useState } from 'react'
import { PageHeader } from '../components/Card'
import { FeedbackCard } from '../components/FeedbackCard'
import { FeedbackForm } from '../components/FeedbackForm'
import { Icon } from '../components/Icon'
import { SearchInput } from '../components/SearchInput'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { useFeedbacks } from '../hooks/useFeedbacks'
import type { FeedbackStatus } from '../types'

export function FeedbacksPage() {
  const { data, loading, error, reload, createFeedback } = useFeedbacks()
  const [formOpen, setFormOpen] = useState(false)
  const [savedStatus, setSavedStatus] = useState<FeedbackStatus | null>(null)
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

  return (
    <>
      <PageHeader
        title="Feedbacks"
        subtitle="Published client feedback from the website. Only published records are shown."
        action={
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setFormOpen((open) => !open)
              setSavedStatus(null)
            }}
          >
            <Icon name={formOpen ? 'arrow-left' : 'plus'} size={18} />
            {formOpen ? 'Close form' : 'Add Feedback'}
          </button>
        }
      />

      {savedStatus && (
        <div className="feedback-notice feedback-notice-success" role="status">
          <Icon name="check" size={16} />
          <span>
            {savedStatus === 'published'
              ? 'Feedback published. It now appears on the Nagriva website.'
              : 'Feedback saved as pending. It will appear on the website once it is reviewed and published.'}
          </span>
          <button
            type="button"
            className="feedback-notice-dismiss"
            onClick={() => setSavedStatus(null)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {formOpen && (
        <FeedbackForm
          onCancel={() => setFormOpen(false)}
          onSubmitted={(status) => {
            setFormOpen(false)
            setSavedStatus(status)
            reload()
          }}
          createFeedback={createFeedback}
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
              ? 'No published feedback yet'
              : 'No feedback matches your search'
          }
          description={
            data.length === 0
              ? 'Feedback appears here once it has been reviewed and published on the website.'
              : 'Try a different name, company, role, or keyword.'
          }
        />
      ) : (
        <div className="feedback-list">
          {results.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </>
  )
}
