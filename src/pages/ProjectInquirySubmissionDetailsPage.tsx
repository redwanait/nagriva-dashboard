import { Card } from '../components/Card'
import { Icon, WhatsAppIcon } from '../components/Icon'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { useRouter } from '../router'
import { useProjectInquiry } from '../hooks/useProjectInquiry'
import { formatDateTime } from '../utils/date'
import type { Submission } from '../types'

interface ProjectInquirySubmissionDetailsPageProps {
  submissionId?: string
}

function DetailValue({ value }: { value?: string }) {
  const text = value?.trim()
  if (!text) return <span className="value-empty">Not provided</span>
  return <>{text}</>
}

export function ProjectInquirySubmissionDetailsPage({
  submissionId,
}: ProjectInquirySubmissionDetailsPageProps) {
  const { navigate } = useRouter()
  const { data, loading, error, reload } = useProjectInquiry(submissionId)

  const goBack = () =>
    navigate({ page: 'submissions-inbox', categoryId: 'project_inquiries' })

  const backButton = (
    <button type="button" className="back-button" onClick={goBack}>
      <Icon name="arrow-left" size={18} />
      Find Your Project
    </button>
  )

  if (loading) {
    return (
      <>
        {backButton}
        <LoadingState label="Loading submission…" />
      </>
    )
  }

  if (error) {
    return (
      <>
        {backButton}
        <ErrorState message={error} onRetry={reload} />
      </>
    )
  }

  if (!data) {
    return (
      <>
        {backButton}
        <EmptyState
          title="Submission not found"
          description="This submission may have been removed."
        />
      </>
    )
  }

  return <ProjectInquiryDetailsContent submission={data} onBack={goBack} />
}

function ProjectInquiryDetailsContent({
  submission,
  onBack,
}: {
  submission: Submission
  onBack: () => void
}) {
  const initials = submission.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  const waNumber = submission.phone?.replace(/[^\d]/g, '')

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        <Icon name="arrow-left" size={18} />
        Find Your Project
      </button>

      <div className="details-header">
        <div className="details-identity">
          <span className="details-avatar">{initials}</span>
          <div>
            <h1 className="page-title">{submission.name}</h1>
            <p className="page-subtitle">Find Your Project</p>
          </div>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {submission.phone && waNumber && (
        <div className="details-actions">
          <a
            className="button button-whatsapp"
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={18} />
            WhatsApp
          </a>
        </div>
      )}

      <div className="details-grid">
        <Card className="details-card">
          <h2 className="card-title">Project description</h2>
          <div className="request-list">
            <div className="request-field">
              <span className="request-label">What they want to build</span>
              <span className="request-value request-value-long">
                <DetailValue value={submission.summary} />
              </span>
            </div>
          </div>
        </Card>

        <Card className="details-card">
          <h2 className="card-title">Request details</h2>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>WhatsApp</dt>
              <dd>
                <DetailValue value={submission.phone} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd>
                <DetailValue value={submission.status} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Received</dt>
              <dd>{formatDateTime(submission.createdAt)}</dd>
            </div>
            <div className="detail-row">
              <dt>Source</dt>
              <dd>project_inquiries</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  )
}
