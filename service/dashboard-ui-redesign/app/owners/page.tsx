'use client'

import { AppLayout } from '@/components/app-layout'
import { OwnersContent } from '@/components/owners/owners-content'

export default function OwnersPage() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Owners' }]}>
      <OwnersContent />
    </AppLayout>
  )
}
