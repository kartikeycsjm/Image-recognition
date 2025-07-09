import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'A.I. Image',
  description: 'Created By Kartikey Mishra',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
