export type SubmissionStatus =
  | 'New'
  | 'Contacted'
  | 'In Discussion'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost'

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Proposal Sent',
  'Won',
  'Lost',
]

export type SubmissionCategoryId =
  | 'inquiries'
  | 'project_inquiries'
  | 'call_bookings'

export interface Note {
  id: string
  text: string
  createdAt: string
}

export interface SubmissionField {
  label: string
  value: string
}

export interface InquiryDetails {
  need: string
  projectId?: string
  projectTitle?: string
  projectUrl?: string
  budget?: string
  timeline?: string
  company?: string
  contactMethod?: string
  about: string
}

export interface Submission {
  id: string
  categoryId: SubmissionCategoryId
  name: string
  phone?: string
  email?: string
  summary: string
  status: string
  createdAt: string
  fields: SubmissionField[]
  inquiry?: InquiryDetails
  notes: Note[]
}

/**
 * A published feedback record as read from `public.feedbacks`. Only published
 * rows are ever fetched by the dashboard, so `status` is informational.
 */
export interface Feedback {
  id: string
  authorName: string
  authorRole?: string
  authorCompany?: string
  authorAvatarUrl?: string
  content: string
  status: string
  createdAt: string
  publishedAt?: string
}

/** Status an administrator can choose when adding a feedback. */
export type FeedbackStatus = 'pending' | 'published'

/** Values an administrator can provide when adding a feedback. */
export interface FeedbackInput {
  authorName: string
  authorRole?: string
  authorCompany?: string
  authorAvatarUrl?: string
  content: string
  status: FeedbackStatus
}

export type NotificationType = 'submission' | 'status' | 'message'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  read: boolean
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
}

export type PageName =
  | 'overview'
  | 'submissions'
  | 'submissions-inbox'
  | 'details'
  | 'feedbacks'
  | 'notifications'
  | 'settings'

export interface Route {
  page: PageName
  categoryId?: SubmissionCategoryId
  submissionId?: string
}
