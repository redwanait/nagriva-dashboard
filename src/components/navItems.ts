import type { IconName } from './Icon'
import type { PageName } from '../types'

export interface NavItem {
  page: PageName
  label: string
  icon: IconName
}

export const navItems: NavItem[] = [
  { page: 'submissions', label: 'Submissions', icon: 'inbox' },
  { page: 'feedbacks', label: 'Feedbacks', icon: 'message' },
]
