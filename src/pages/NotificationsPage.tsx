import { Card, PageHeader } from '../components/Card'
import { Icon, type IconName } from '../components/Icon'
import { notifications } from '../data/mockData'
import type { NotificationType } from '../types'

const typeIcon: Record<NotificationType, IconName> = {
  submission: 'inbox',
  status: 'check',
  message: 'mail',
}

export function NotificationsPage() {
  const unread = notifications.filter((item) => !item.read).length

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={
          unread > 0 ? `${unread} unread updates` : 'You are all caught up.'
        }
      />

      <div className="notification-list">
        {notifications.map((item) => (
          <Card
            key={item.id}
            className={`notification-card ${item.read ? '' : 'is-unread'}`}
          >
            <span className={`notification-icon type-${item.type}`}>
              <Icon name={typeIcon[item.type]} size={18} />
            </span>
            <div className="notification-body">
              <div className="notification-top">
                <span className="notification-title">{item.title}</span>
                {!item.read && <span className="unread-dot" />}
              </div>
              <p className="notification-desc">{item.description}</p>
              <span className="notification-time">{item.time}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
