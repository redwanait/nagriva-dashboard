const statusClass: Record<string, string> = {
  new: 'badge-new',
  pending: 'badge-new',
  contacted: 'badge-contacted',
  booked: 'badge-discussion',
  in_discussion: 'badge-discussion',
  'in discussion': 'badge-discussion',
  proposal_sent: 'badge-proposal',
  'proposal sent': 'badge-proposal',
  won: 'badge-won',
  done: 'badge-won',
  published: 'badge-won',
  lost: 'badge-lost',
  cancelled: 'badge-lost',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.trim().toLowerCase()
  const className = statusClass[key] ?? 'badge-default'

  return (
    <span className={`badge ${className}`}>
      <span className="badge-dot" />
      {status}
    </span>
  )
}
