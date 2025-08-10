'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Findora</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <Link href="/dashboard">
                    <Button size="sm">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Welcome to Findora
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Your modern e-commerce platform with secure authentication, 
            seamless user experience, and comprehensive features for buyers and sellers.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Advanced security with JWT tokens, OAuth integration, and secure password hashing.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Built with Next.js and optimized for performance with server-side rendering.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Friendly</h3>
              <p className="text-gray-600">
                Intuitive design with accessibility compliance and mobile-first approach.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
