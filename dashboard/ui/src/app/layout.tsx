import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saku Worker Dashboard',
  description: 'Agent management for Mac Studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: 'system-ui', background: '#0f0f0f', color: '#f0f0f0' }}>
        <nav style={{ padding: '12px 24px', borderBottom: '1px solid #222', display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: 18 }}>🐾 Saku Worker</span>
          <a href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Dashboard</a>
          <a href="/agents" style={{ color: '#aaa', textDecoration: 'none' }}>Agents</a>
          <a href="/router" style={{ color: '#aaa', textDecoration: 'none' }}>Router</a>
          <a href="/logs" style={{ color: '#aaa', textDecoration: 'none' }}>Logs</a>
        </nav>
        <main style={{ padding: 24 }}>
          {children}
        </main>
      </body>
    </html>
  )
}
