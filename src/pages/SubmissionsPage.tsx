import { Card, PageHeader } from '../components/Card'
import { Icon } from '../components/Icon'
import { submissionCategories } from '../data/submissions'
import { useRouter } from '../router'
import { useInquiries } from '../hooks/useInquiries'
import { useProjectInquiries } from '../hooks/useProjectInquiries'
import { useCallBookings } from '../hooks/useCallBookings'

export function SubmissionsPage() {
  const { navigate } = useRouter()
  const inquiries = useInquiries()
  const projectInquiries = useProjectInquiries()
  const callBookings = useCallBookings()

  return (
    <>
      <PageHeader
        title="Submissions"
        subtitle="Choose an inbox to review incoming requests."
      />

      <div className="category-grid">
        {submissionCategories.map((category) => {
          // All three inboxes read live Supabase data.
          const live =
            category.id === 'inquiries'
              ? inquiries
              : category.id === 'project_inquiries'
                ? projectInquiries
                : callBookings
          const records = live.data
          const isLoading = live.loading
          const hasError = live.error !== null

          return (
            <Card key={category.id} className="category-card">
              <button
                type="button"
                className="category-card-button"
                onClick={() =>
                  navigate({
                    page: 'submissions-inbox',
                    categoryId: category.id,
                  })
                }
              >
                <span className="category-icon">
                  <Icon name={category.icon} size={20} />
                </span>

                <span className="category-body">
                  <span className="category-label">{category.label}</span>
                  <span className="category-desc">{category.description}</span>
                  <span className="category-table">{category.table}</span>

                  <span className="category-counts">
                    {isLoading ? (
                      <span className="category-count">Loading…</span>
                    ) : hasError ? (
                      <span className="category-count">Unavailable</span>
                    ) : (
                      <>
                        <span className="category-count">
                          <strong>{records.length}</strong> total
                        </span>
                      </>
                    )}
                  </span>
                </span>

                <Icon
                  name="chevron-right"
                  size={18}
                  className="category-chevron"
                />
              </button>
            </Card>
          )
        })}
      </div>
    </>
  )
}
