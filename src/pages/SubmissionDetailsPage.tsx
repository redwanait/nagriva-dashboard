import { InquirySubmissionDetailsPage } from './InquirySubmissionDetailsPage'
import { ProjectInquirySubmissionDetailsPage } from './ProjectInquirySubmissionDetailsPage'
import { CallBookingSubmissionDetailsPage } from './CallBookingSubmissionDetailsPage'
import { MockSubmissionDetailsPage } from './MockSubmissionDetailsPage'
import type { SubmissionCategoryId } from '../types'

interface SubmissionDetailsPageProps {
  categoryId?: SubmissionCategoryId
  submissionId?: string
}

export function SubmissionDetailsPage({
  categoryId,
  submissionId,
}: SubmissionDetailsPageProps) {
  if (categoryId === 'inquiries') {
    return <InquirySubmissionDetailsPage submissionId={submissionId} />
  }

  if (categoryId === 'project_inquiries') {
    return <ProjectInquirySubmissionDetailsPage submissionId={submissionId} />
  }

  if (categoryId === 'call_bookings') {
    return <CallBookingSubmissionDetailsPage submissionId={submissionId} />
  }

  return (
    <MockSubmissionDetailsPage
      categoryId={categoryId}
      submissionId={submissionId}
    />
  )
}
