import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
            FOUNDEROS
          </h1>
          <p className="text-xl md:text-2xl tracking-wide text-gray-700">
            TRACK • DECIDE • SHIP
          </p>
        </div>

        <div className="pt-8 space-y-4 max-w-sm mx-auto">
          <Link href="/login" className="block">
            <button className="btn-primary w-full">
              GET STARTED
            </button>
          </Link>
          <p className="text-sm text-gray-600">
            Transform experiments into deterministic decisions
          </p>
        </div>
      </div>
    </div>
  )
}