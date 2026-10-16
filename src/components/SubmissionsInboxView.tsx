import { useMemo, useState } from 'react'
import { Card, PageHeader } from './Card'
import { Icon } from './Icon'
import { SearchInput } from './SearchInput'
import { StatusBadge } from './StatusBadge'
import { EmptyState, ErrorState, LoadingState } from './States'
import { formatDate } from '../utils/date'
import type { SubmissionCategory } from '../data/submissions'
import type { Submission } from '../types'

const PAGE_SIZE = 5

interface SubmissionsInboxViewProps {
  category: SubmissionCategory
  records: Submission[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onBack: () => void
  onOpen: (submissionId: string) => void
  searchPlaceholder?: string
}

export function SubmissionsInboxView({
  category,
  records,
  loading,
  error,
  onRetry,
  onBack,
  onOpen,
  searchPlaceholder = 'Search by name or phone',
}: SubmissionsInboxViewProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const statusOptions = useMemo(() => {
    const unique = new Set<string>()
    records.forEach((record) => {
      const value = record.status?.trim()
      if (value) unique.add(value)
    })
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [records])

  const activeStatus =
    status === 'All' || statusOptions.includes(status) ? status : 'All'

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return records.filter((submission) => {
      const matchesStatus =
        activeStatus === 'All' || submission.status === activeStatus
      const matchesQuery =
        term.length === 0 ||
        submission.name.toLowerCase().includes(term) ||
        (submission.phone?.toLowerCase().includes(term) ?? false) ||
        (submission.email?.toLowerCase().includes(term) ?? false) ||
        submission.summary.toLowerCase().includes(term)
      return matchesStatus && matchesQuery
    })
  }, [records, query, activeStatus])

  const visibleResults = results.slice(0, visible)

  const updateQuery = (value: string) => {
    setQuery(value)
    setVisible(PAGE_SIZE)
  }

  const updateStatus = (value: string) => {
    setStatus(value)
    setVisible(PAGE_SIZE)
  }

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        <Icon name="arrow-left" size={18} />
        Submissions
      </button>

      <PageHeader title={category.label} subtitle={category.description} />

      <div className="submissions-toolbar">
        <SearchInput
          value={query}
          onChange={updateQuery}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="filter-row">
        {['All', ...statusOptions].map((item) => (
          <button
            key={item}
            type="button"
            className={`chip ${activeStatus === item ? 'is-active' : ''}`}
            onClick={() => updateStatus(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No submissions found"
          description={
            records.length === 0
              ? 'There are no submissions in this inbox yet.'
              : 'Try a different name, phone, or status.'
          }
        />
      ) : (
        <>
          <div className="submission-list">
            {visibleResults.map((submission) => (
              <Card key={submission.id} className="submission-card">
                <button
                  type="button"
                  className="submission-card-button"
                  onClick={() => onOpen(submission.id)}
                >
                  <div className="submission-main">
                    <div className="submission-top">
                      <span className="submission-name">{submission.name}</span>
                      <StatusBadge status={submission.status} />
                    </div>
                    <span className="submission-summary">
                      {submission.summary}
                    </span>
                    <div className="submission-meta">
                      {submission.phone && (
                        <span className="meta-item">
                          <Icon name="phone" size={15} />
                          {submission.phone}
                        </span>
                      )}
                      <span className="meta-item">
                        <Icon name="calendar" size={15} />
                        {formatDate(submission.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Icon
                    name="chevron-right"
                    size={18}
                    className="submission-chevron"
                  />
                </button>
              </Card>
            ))}
          </div>

          {visible < results.length && (
            <div className="load-more">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
              >
                Load more
                <Icon
                  name="chevron-right"
                  size={16}
                  className="load-more-icon"
                />
              </button>
              <span className="load-more-count">
                Showing {visibleResults.length} of {results.length}
              </span>
            </div>
          )}
        </>
      )}
    </>
  )
}
