'use client'

import { AppLayout } from '@/components/app-layout'
import { AssistantContent } from '@/components/assistant/assistant-content'

export default function AssistantPage() {
  return (
    <AppLayout breadcrumbs={[{ label: 'AI Assistant' }]}>
      <AssistantContent />
    </AppLayout>
  )
}
