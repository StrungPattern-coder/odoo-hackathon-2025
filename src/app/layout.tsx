import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillSync - Learn. Share. Grow.',
  description: 'A platform where skills are swapped, connections are made, and growth never stops.',
  keywords: ['skills', 'learning', 'education', 'swap', 'networking'],
  authors: [{ name: 'SkillSync Team' }],
  openGraph: {
    title: 'SkillSync - Learn. Share. Grow.',
    description: 'A platform where skills are swapped, connections are made, and growth never stops.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
