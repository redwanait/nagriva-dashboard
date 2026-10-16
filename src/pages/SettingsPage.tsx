import { useState } from 'react'
import { Card, PageHeader } from '../components/Card'
import { Toggle } from '../components/Toggle'

interface SettingRowProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function SettingRow({ title, description, checked, onChange }: SettingRowProps) {
  return (
    <div className="setting-row">
      <div className="setting-text">
        <span className="setting-title">{title}</span>
        <span className="setting-desc">{description}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

export function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [whatsappAlerts, setWhatsappAlerts] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your workspace preferences."
      />

      <Card className="details-card">
        <h2 className="card-title">Business profile</h2>
        <div className="field-grid">
          <label className="field">
            <span className="field-label">Business name</span>
            <input className="input" defaultValue="Nagriva" />
          </label>
          <label className="field">
            <span className="field-label">Contact email</span>
            <input className="input" defaultValue="contact@nagriva.ma" />
          </label>
          <label className="field">
            <span className="field-label">Support phone</span>
            <input className="input" defaultValue="+212 728427278" />
          </label>
        </div>
      </Card>

      <Card className="details-card">
        <h2 className="card-title">Notifications</h2>
        <div className="settings-list">
          <SettingRow
            title="Email alerts"
            description="Get an email for every new submission."
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
          <SettingRow
            title="WhatsApp alerts"
            description="Receive a WhatsApp message for urgent requests."
            checked={whatsappAlerts}
            onChange={setWhatsappAlerts}
          />
          <SettingRow
            title="Weekly digest"
            description="A summary of your pipeline every Monday."
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </div>
      </Card>

      <div className="settings-actions">
        <button type="button" className="button button-primary">
          Save changes
        </button>
      </div>
    </>
  )
}
