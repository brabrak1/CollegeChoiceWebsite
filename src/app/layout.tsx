import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { GuestBanner } from '@/components/layout/GuestBanner'
import { auth } from '@/lib/auth'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CollegeChoice — Decide where you belong',
  description: 'Visualize, compare, and decide between your college acceptances.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Providers session={session}>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <GuestBanner />
        </Providers>
      </body>
    </html>
  )
}
