import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'VetCRM - Veterinary Clinic Dashboard',
  description: 'Complete veterinary clinic CRM with pet records, appointments, medical history, and AI assistant. Built with Next.js 15, shadcn/ui, and Vercel AI SDK.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: 'VetCRM - Veterinary Clinic Dashboard',
    description: 'Complete veterinary clinic CRM with pet records, appointments, medical history, and AI assistant. Built with Next.js 15, shadcn/ui, and Vercel AI SDK.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VetCRM Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VetCRM - Veterinary Clinic Dashboard',
    description: 'Complete veterinary clinic CRM with pet records, appointments, medical history, and AI assistant. Built with Next.js 15, shadcn/ui, and Vercel AI SDK.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
