import { Card } from '../components/Card'
import { Icon, WhatsAppIcon } from '../components/Icon'
import { EmptyState, ErrorState, LoadingState } from '../components/States'
import { StatusBadge } from '../components/StatusBadge'
import { useRouter } from '../router'
import { useCallBooking } from '../hooks/useCallBooking'
import { formatDateTime } from '../utils/date'
import type { Submission } from '../types'

interface CallBookingSubmissionDetailsPageProps {
  submissionId?: string
}

function DetailValue({ value }: { value?: string }) {
  const text = value?.trim()
  if (!text) return <span className="value-empty">Not provided</span>
  return <>{text}</>
}

export function CallBookingSubmissionDetailsPage({
  submissionId,
}: CallBookingSubmissionDetailsPageProps) {
  const { navigate } = useRouter()
  const { data, loading, error, reload } = useCallBooking(submissionId)

  const goBack = () =>
    navigate({ page: 'submissions-inbox', categoryId: 'call_bookings' })

  const backButton = (
    <button type="button" className="back-button" onClick={goBack}>
      <Icon name="arrow-left" size={18} />
      Book a Free Call
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

  return <CallBookingDetailsContent submission={data} onBack={goBack} />
}

function CallBookingDetailsContent({
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
  const callMethod = submission.fields.find(
    (field) => field.label === 'Call method',
  )?.value

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        <Icon name="arrow-left" size={18} />
        Book a Free Call
      </button>

      <div className="details-header">
        <div className="details-identity">
          <span className="details-avatar">{initials}</span>
          <div>
            <h1 className="page-title">{submission.name}</h1>
            <p className="page-subtitle">Book a Free Call</p>
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
          <h2 className="card-title">Client contact</h2>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Name</dt>
              <dd>{submission.name}</dd>
            </div>
            <div className="detail-row">
              <dt>Phone number</dt>
              <dd>
                <DetailValue value={submission.phone} />
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="details-card">
          <h2 className="card-title">Call details</h2>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Call method</dt>
              <dd>
                <DetailValue value={callMethod} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd>
                <DetailValue value={submission.status} />
              </dd>
            </div>
            <div className="detail-row">
              <dt>Requested</dt>
              <dd>{formatDateTime(submission.createdAt)}</dd>
            </div>
            <div className="detail-row">
              <dt>Source</dt>
              <dd>call_bookings</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  )
}
