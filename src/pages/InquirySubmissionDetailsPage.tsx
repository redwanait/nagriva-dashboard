import { Card } from '../components/Card'
import { Icon, WhatsAppIcon } from '../components/Icon'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { useRouter } from '../router'
import { useInquiry } from '../hooks/useInquiry'
import type { Submission } from '../types'

interface InquirySubmissionDetailsPageProps {
  submissionId?: string
}

function DetailValue({ value }: { value?: string }) {
  const text = value?.trim()
  if (!text) return <span className="value-empty">Not provided</span>
  return <>{text}</>
}

export function InquirySubmissionDetailsPage({
  submissionId,
}: InquirySubmissionDetailsPageProps) {
  const { navigate } = useRouter()
  const { data, loading, error, reload } = useInquiry(submissionId)

  const goBack = () =>
    navigate({ page: 'submissions-inbox', categoryId: 'inquiries' })

  const backButton = (
    <button type="button" className="back-button" onClick={goBack}>
      <Icon name="arrow-left" size={18} />
      Start with Nagriva
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

  return <InquiryDetailsContent submission={data} onBack={goBack} />
}

function InquiryDetailsContent({
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
  const { inquiry } = submission

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        <Icon name="arrow-left" size={18} />
        Start with Nagriva
      </button>

      <div className="details-header">
        <div className="details-identity">
          <span className="details-avatar">{initials}</span>
          <div>
            <h1 className="page-title">{submission.name}</h1>
            <p className="page-subtitle">Start with Nagriva</p>
          </div>
        </div>
        <StatusBadge status={submission.status} />
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
            <div className="detail-row">
              <dt>Full name</dt>
              <dd>{submission.name}</dd>
            </div>
            <div className="detail-row">
              <dt>Email address</dt>
              <dd>
                <DetailValue value={submission.email} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Phone / WhatsApp</dt>
              <dd>
                <DetailValue value={submission.phone} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>What do you need?</dt>
              <dd>
                <DetailValue value={inquiry?.need} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Do you have a Project ID?</dt>
              <dd>
                <DetailValue value={inquiry?.projectId} />
              </dd>
            </div>
            {inquiry?.projectTitle && (
              <div className="detail-row">
                <dt>Linked project</dt>
                <dd>
                  {inquiry.projectUrl ? (
                    <a
                      className="link-button"
                      href={inquiry.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {inquiry.projectTitle}
                    </a>
                  ) : (
                    inquiry.projectTitle
                  )}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="details-card">
          <h2 className="card-title">Optional Details</h2>
          <div className="request-list">
            <div className="request-field">
              <span className="request-label">Estimated budget</span>
              <span className="request-value">
                <DetailValue value={inquiry?.budget} />
              </span>
            </div>
            <div className="request-field">
              <span className="request-label">Timeline</span>
              <span className="request-value">
                <DetailValue value={inquiry?.timeline} />
              </span>
            </div>
            <div className="request-field">
              <span className="request-label">Company / brand</span>
              <span className="request-value">
                <DetailValue value={inquiry?.company} />
              </span>
            </div>
            <div className="request-field">
              <span className="request-label">How should we contact you?</span>
              <span className="request-value">
                <DetailValue value={inquiry?.contactMethod} />
              </span>
            </div>
            <div className="request-field">
              <span className="request-label">About your project</span>
              <span className="request-value request-value-long">
                <DetailValue value={inquiry?.about} />
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
