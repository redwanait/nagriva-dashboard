import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { SubmissionsInboxView } from '../components/SubmissionsInboxView'
import { getCategory, getCategorySubmissions } from '../data/submissions'
import { useRouter } from '../router'
import { useInquiries } from '../hooks/useInquiries'
import { useProjectInquiries } from '../hooks/useProjectInquiries'
import { useCallBookings } from '../hooks/useCallBookings'
import type { SubmissionCategoryId } from '../types'

interface SubmissionsInboxPageProps {
  categoryId?: SubmissionCategoryId
}

export function SubmissionsInboxPage({
  categoryId,
}: SubmissionsInboxPageProps) {
  if (categoryId === 'inquiries') {
    return <InquiryInboxPage />
  }
  if (categoryId === 'project_inquiries') {
    return <ProjectInquiryInboxPage />
  }
  if (categoryId === 'call_bookings') {
    return <CallBookingInboxPage />
  }
  return <MockInboxPage categoryId={categoryId} />
}

function MockInboxPage({ categoryId }: SubmissionsInboxPageProps) {
  const { navigate } = useRouter()
  const category = categoryId ? getCategory(categoryId) : undefined

  if (!category) {
    return <MissingInbox />
  }

  return (
    <SubmissionsInboxView
      category={category}
      records={getCategorySubmissions(category.id)}
      loading={false}
      error={null}
      onRetry={() => {}}
      onBack={() => navigate({ page: 'submissions' })}
      onOpen={(submissionId) =>
        navigate({
          page: 'details',
          categoryId: category.id,
          submissionId,
        })
      }
    />
  )
}

function InquiryInboxPage() {
  const { navigate } = useRouter()
  const category = getCategory('inquiries')
  const { data, loading, error, reload } = useInquiries()

  if (!category) {
    return <MissingInbox />
  }

  return (
    <SubmissionsInboxView
      category={category}
      records={data}
      loading={loading}
      error={error}
      onRetry={reload}
      onBack={() => navigate({ page: 'submissions' })}
      onOpen={(submissionId) =>
        navigate({ page: 'details', categoryId: 'inquiries', submissionId })
      }
    />
  )
}

function ProjectInquiryInboxPage() {
  const { navigate } = useRouter()
  const category = getCategory('project_inquiries')
  const { data, loading, error, reload } = useProjectInquiries()

  if (!category) {
    return <MissingInbox />
  }

  return (
    <SubmissionsInboxView
      category={category}
      records={data}
      loading={loading}
      error={error}
      onRetry={reload}
      onBack={() => navigate({ page: 'submissions' })}
      onOpen={(submissionId) =>
        navigate({
          page: 'details',
          categoryId: 'project_inquiries',
          submissionId,
        })
      }
      searchPlaceholder="Search by WhatsApp number or description"
    />
  )
}

function CallBookingInboxPage() {
  const { navigate } = useRouter()
  const category = getCategory('call_bookings')
  const { data, loading, error, reload } = useCallBookings()

  if (!category) {
    return <MissingInbox />
  }

  return (
    <SubmissionsInboxView
      category={category}
      records={data}
      loading={loading}
      error={error}
      onRetry={reload}
      onBack={() => navigate({ page: 'submissions' })}
      onOpen={(submissionId) =>
        navigate({
          page: 'details',
          categoryId: 'call_bookings',
          submissionId,
        })
      }
    />
  )
}

function MissingInbox() {
  const { navigate } = useRouter()
  return (
    <Card className="empty-state">
      <Icon name="inbox" size={26} />
      <p className="empty-title">Inbox not found</p>
      <button
        type="button"
        className="button button-secondary"
        onClick={() => navigate({ page: 'submissions' })}
      >
        Back to submissions
      </button>
    </Card>
  )
}
