import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getExperiments } from '@/app/actions/experiments'
import DashboardClient from '@/components/DashboardClient'
import { signOut } from '@/app/actions/auth'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { experiments, metrics } = await getExperiments()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">FounderOS</h1>
            <form action={signOut}>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient 
          initialExperiments={experiments} 
          initialMetrics={metrics}
        />
      </main>
    </div>
  )
}