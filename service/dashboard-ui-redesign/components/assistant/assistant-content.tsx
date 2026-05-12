'use client'

import React from "react"

import { useRef, useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useAgentSettings, usePets, useOwners, useAppointments } from '@/lib/data-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, Bot, User, Settings, Loader2 } from 'lucide-react'
import { AgentSettingsDialog } from './agent-settings-dialog'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

// Helper to extract text from UIMessage parts
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
}

export function AssistantContent() {
  const { settings } = useAgentSettings()
  const { pets } = usePets()
  const { owners } = useOwners()
  const { appointments } = useAppointments()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Build context about the clinic data
  const clinicContext = `
Current clinic data summary:
- Total pets: ${pets.length}
- Total owners: ${owners.length}
- Total appointments: ${appointments.length}
- Today's date: ${new Date().toLocaleDateString()}

Recent pets: ${pets.slice(0, 3).map((p) => `${p.name} (${p.species})`).join(', ')}
Recent owners: ${owners.slice(0, 3).map((o) => `${o.firstName} ${o.lastName}`).join(', ')}
`

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat',
      body: {
        model: settings.model,
        temperature: settings.temperature,
        systemPrompt: settings.systemPrompt + '\n\n' + clinicContext,
      },
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const clearChat = () => {
    setMessages([])
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      sendMessage({ text: input })
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] p-3 md:p-6">
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <CardHeader className="border-b py-2 md:py-3 px-3 md:px-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm md:text-base min-w-0">
              <Bot className="size-4 md:size-5 text-primary shrink-0" />
              <span className="truncate">{settings.model.split('/').pop()}</span>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="size-8" onClick={clearChat} disabled={messages.length === 0}>
                <MessageSquare className="size-4" />
                <span className="sr-only">Clear Chat</span>
              </Button>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setSettingsOpen(true)}>
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
          <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 md:py-12 px-2">
                <MessageSquare className="size-10 md:size-12 text-muted-foreground/50 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  I can help with patient info, appointments, medical records, and veterinary questions.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-6">
                  {[
                    "How many pets?",
                    "Today's appointments",
                    "Anxious pet tips",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="text-xs md:text-sm bg-transparent"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2 md:gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="size-3.5 md:size-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 md:px-4 max-w-[85%] md:max-w-[75%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap break-words">{getMessageText(message)}</p>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2 prose-pre:my-2 prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-background/50 prose-pre:text-xs">
                          <ReactMarkdown>{getMessageText(message)}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <User className="size-3.5 md:size-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 md:gap-3">
                    <div className="flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="size-3.5 md:size-4" />
                    </div>
                    <div className="rounded-lg px-3 py-2 md:px-4 bg-muted">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <form
            onSubmit={handleSubmit}
            className="border-t p-3 md:p-4 flex gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your clinic..."
              className="min-h-[44px] max-h-24 md:max-h-32 resize-none text-sm md:text-base"
              rows={1}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="shrink-0" 
              disabled={isLoading || !input.trim()}
            >
              <Send className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <AgentSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
