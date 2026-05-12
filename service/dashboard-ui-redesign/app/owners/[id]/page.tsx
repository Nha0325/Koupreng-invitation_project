import { AppLayout } from '@/components/app-layout'
import { OwnerDetailContent } from '@/components/owners/owner-detail-content'

interface OwnerDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OwnerDetailPage({ params }: OwnerDetailPageProps) {
  const { id } = await params

  return (
    <AppLayout breadcrumbs={[{ label: 'Owners', href: '/owners' }, { label: 'Details' }]}>
      <OwnerDetailContent ownerId={id} />
    </AppLayout>
  )
}
