'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../../components/Navigation'

export default function MainLayout({ children }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <main className="menu-card">
        <header className="menu-header">
          <h1>Crave<span>ly</span></h1>
          <p>Student Food Discovery</p>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: 'var(--gray)' }}>
          Loading...
        </div>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return <Navigation>{children}</Navigation>
}
