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
 * A feedback record as read from `public.feedbacks`. The dashboard loads every
 * status so the administrator can moderate, edit, and delete entries.
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

/** Status an administrator can choose when adding or editing a feedback. */
export type FeedbackStatus = 'pending' | 'published' | 'rejected'

/** Every status the administrator may assign, in display order. */
export const FEEDBACK_STATUSES: readonly FeedbackStatus[] = [
  'published',
  'pending',
  'rejected',
]

/** Values an administrator can provide when adding a feedback. */
export interface FeedbackInput {
  authorName: string
  authorRole?: string
  authorCompany?: string
  authorAvatarUrl?: string
  content: string
  status: FeedbackStatus
}

export type PageName =
  | 'submissions'
  | 'submissions-inbox'
  | 'details'
  | 'feedbacks'

export interface Route {
  page: PageName
  categoryId?: SubmissionCategoryId
  submissionId?: string
}
