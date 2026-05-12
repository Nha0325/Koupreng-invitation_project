'use client'

import { AppLayout } from '@/components/app-layout'
import { PetsContent } from '@/components/pets/pets-content'

export default function PetsPage() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Pets' }]}>
      <PetsContent />
    </AppLayout>
  )
}
