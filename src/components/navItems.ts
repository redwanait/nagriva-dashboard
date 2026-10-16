import type { IconName } from './Icon'
import type { PageName } from '../types'

export interface NavItem {
  page: PageName
  label: string
  icon: IconName
}

export const navItems: NavItem[] = [
  { page: 'overview', label: 'Overview', icon: 'overview' },
  { page: 'submissions', label: 'Submissions', icon: 'inbox' },
  { page: 'feedbacks', label: 'Feedbacks', icon: 'message' },
  { page: 'notifications', label: 'Notifications', icon: 'bell' },
  { page: 'settings', label: 'Settings', icon: 'settings' },
]
