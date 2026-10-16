import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { brand } from '../config/brand'
import { profile } from '../config/profile'
import { useAuth } from '../auth/authContext'

export function Header() {
  const { signOut } = useAuth()

  return (
    <header className="app-header">
      <div className="brand">
        <img className="brand-logo" src={brand.logo} alt={brand.name} />
        <span className="brand-name brand-name-light">Dashboard</span>
      </div>

      <div className="header-actions">
        <button type="button" className="icon-button" aria-label="Notifications">
          <Icon name="bell" size={19} />
        </button>
        <div className="profile">
          <Avatar src={profile.avatar} alt={profile.name} size={38} />
          <div className="profile-meta">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-role">{profile.role}</span>
          </div>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Sign out"
          title="Sign out"
          onClick={() => void signOut()}
        >
          <Icon name="logout" size={19} />
        </button>
      </div>
    </header>
  )
}
