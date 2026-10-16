import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { navItems } from './navItems'
import { useRouter } from '../router'
import { brand } from '../config/brand'
import { profile } from '../config/profile'
import { useAuth } from '../auth/authContext'
import type { PageName } from '../types'

function isActive(current: PageName, target: PageName): boolean {
  if (current === 'details' && target === 'submissions') return true
  if (current === 'submissions-inbox' && target === 'submissions') return true
  return current === target
}

export function Sidebar() {
  const { route, navigate } = useRouter()
  const { signOut } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img className="brand-logo" src={brand.logo} alt={brand.name} />
        <span className="brand-name brand-name-light">Dashboard</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        {navItems.map((item) => (
          <button
            key={item.page}
            type="button"
            className={`nav-item ${isActive(route.page, item.page) ? 'is-active' : ''}`}
            onClick={() => navigate({ page: item.page })}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Avatar src={profile.avatar} alt={profile.name} size={38} />
        <div className="profile-meta">
          <span className="profile-name">{profile.name}</span>
          <span className="profile-role">{profile.role}</span>
        </div>
        <button
          type="button"
          className="logout-button"
          aria-label="Sign out"
          title="Sign out"
          onClick={() => void signOut()}
        >
          <Icon name="logout" size={18} />
        </button>
      </div>
    </aside>
  )
}
