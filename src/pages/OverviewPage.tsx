import { useMemo } from 'react'
import { Card, PageHeader } from '../components/Card'
import { Icon, type IconName } from '../components/Icon'
import { activity } from '../data/mockData'
import { allSubmissions } from '../data/submissions'
import { useProjectInquiries } from '../hooks/useProjectInquiries'
import { useCallBookings } from '../hooks/useCallBookings'
import { useRouter } from '../router'

interface StatCard {
  label: string
  value: number
  icon: IconName
  hint: string
  accent: string
}

export function OverviewPage() {
  const { navigate } = useRouter()
  const projectInquiries = useProjectInquiries()
  const callBookings = useCallBookings()

  // Replace the mock "Find Your Project" and "Book a Free Call" records with the
  // live Supabase ones so they are never counted twice. Start with Nagriva keeps
  // its existing source.
  const records = useMemo(
    () => [
      ...allSubmissions.filter(
        (s) =>
          s.categoryId !== 'project_inquiries' &&
          s.categoryId !== 'call_bookings',
      ),
      ...projectInquiries.data,
      ...callBookings.data,
    ],
    [projectInquiries.data, callBookings.data],
  )

  const newCount = records.filter((s) => s.status === 'New').length
  const inProgressCount = records.filter((s) =>
    ['Contacted', 'In Discussion', 'Proposal Sent'].includes(s.status),
  ).length
  const wonCount = records.filter((s) => s.status === 'Won').length

  const stats: StatCard[] = [
    {
      label: 'New submissions',
      value: newCount,
      icon: 'inbox',
      hint: 'Awaiting first response',
      accent: 'accent-blue',
    },
    {
      label: 'In progress',
      value: inProgressCount,
      icon: 'clock',
      hint: 'Active conversations',
      accent: 'accent-amber',
    },
    {
      label: 'Won deals',
      value: wonCount,
      icon: 'check',
      hint: 'Closed successfully',
      accent: 'accent-green',
    },
  ]

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="A snapshot of your pipeline today."
      />

      <section className="stat-grid">
        {stats.map((stat) => (
          <Card key={stat.label} className={`stat-card ${stat.accent}`}>
            <div className="stat-icon">
              <Icon name={stat.icon} size={20} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-hint">{stat.hint}</div>
          </Card>
        ))}
      </section>

      <Card className="activity-card">
        <div className="card-head">
          <h2 className="card-title">Recent activity</h2>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate({ page: 'submissions' })}
          >
            View submissions
            <Icon name="chevron-right" size={16} />
          </button>
        </div>

        <ul className="activity-list">
          {activity.map((item) => (
            <li key={item.id} className="activity-item">
              <span className="activity-dot" />
              <div className="activity-text">
                <span className="activity-title">{item.title}</span>
                <span className="activity-desc">{item.description}</span>
              </div>
              <span className="activity-time">{item.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
