import { Icon } from './Icon'
import { navItems } from './navItems'
import { useRouter } from '../router'
import type { PageName } from '../types'

function isActive(current: PageName, target: PageName): boolean {
  if (current === 'details' && target === 'submissions') return true
  if (current === 'submissions-inbox' && target === 'submissions') return true
  return current === target
}

export function BottomNav() {
  const { route, navigate } = useRouter()

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.page}
          type="button"
          className={`bottom-nav-item ${isActive(route.page, item.page) ? 'is-active' : ''}`}
          onClick={() => navigate({ page: item.page })}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
