import './globals.css'

export const metadata = {
  title: 'Draw With Me',
  description: 'Multiplayer Drawing Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
