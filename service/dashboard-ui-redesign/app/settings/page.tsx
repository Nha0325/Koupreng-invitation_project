'use client'

import { AppLayout } from '@/components/app-layout'
import { SettingsContent } from '@/components/settings/settings-content'

export default function SettingsPage() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Settings' }]}>
      <SettingsContent />
    </AppLayout>
  )
}
