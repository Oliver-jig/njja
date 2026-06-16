import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🐱 Ding Ding Cat Sticker Generator',
  description: 'Generate adorable festival cat stickers with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#111', minHeight: '100vh' }}>{children}</body>
    </html>
  )
}
