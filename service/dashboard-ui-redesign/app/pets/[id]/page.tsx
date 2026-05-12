import { AppLayout } from '@/components/app-layout'
import { PetDetailContent } from '@/components/pets/pet-detail-content'

interface PetDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PetDetailPage({ params }: PetDetailPageProps) {
  const { id } = await params

  return (
    <AppLayout breadcrumbs={[{ label: 'Pets', href: '/pets' }, { label: 'Details' }]}>
      <PetDetailContent petId={id} />
    </AppLayout>
  )
}
