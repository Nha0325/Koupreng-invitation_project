import { streamText, convertToModelMessages, UIMessage } from 'ai'

export async function POST(req: Request) {
  const { messages, model, temperature, systemPrompt }: { 
    messages: UIMessage[]
    model?: string
    temperature?: number
    systemPrompt?: string
  } = await req.json()

  const result = streamText({
    model: model || 'anthropic/claude-opus-4.5',
    system: systemPrompt || 'You are a helpful veterinary assistant.',
    messages: await convertToModelMessages(messages),
    temperature: temperature ?? 0.7,
  })

  return result.toUIMessageStreamResponse()
}
