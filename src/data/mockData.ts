import type { ActivityItem, AppNotification } from '../types'

export const notifications: AppNotification[] = [
  {
    id: 'nt-1',
    type: 'submission',
    title: 'New submission received',
    description: 'Aarav Mehta requested a Website Redesign.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'nt-2',
    type: 'status',
    title: 'Deal marked as Won',
    description: 'Vikram Singh moved from Proposal Sent to Won.',
    time: 'Yesterday',
    read: false,
  },
  {
    id: 'nt-3',
    type: 'message',
    title: 'Reply from Priya Nair',
    description: 'She shared additional requirements for the mobile app.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'nt-4',
    type: 'submission',
    title: 'New submission received',
    description: 'Daniel Okafor requested a Landing Page.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 'nt-5',
    type: 'status',
    title: 'Proposal viewed',
    description: 'Emily Carter opened the proposal you sent.',
    time: '4 days ago',
    read: true,
  },
]

export const activity: ActivityItem[] = [
  {
    id: 'ac-1',
    title: 'Aarav Mehta · Website Redesign',
    description: 'New submission created',
    time: '2h ago',
  },
  {
    id: 'ac-2',
    title: 'Vikram Singh · Custom CRM',
    description: 'Status changed to Won',
    time: '1d ago',
  },
  {
    id: 'ac-3',
    title: 'Rahul Sharma · SEO & Content',
    description: 'Note added: Sent competitor analysis deck',
    time: '2d ago',
  },
  {
    id: 'ac-4',
    title: 'Emily Carter · Brand Identity',
    description: 'Proposal Sent',
    time: '4d ago',
  },
]
