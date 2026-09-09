import type { Metadata } from 'next'
import './globals.css'
import ChatbotMount from '@/components/ChatbotMount'

export const metadata: Metadata = {
  title: 'NyumbaSalama',
  description: 'Property management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatbotMount />
      </body>
    </html>
  )
}
