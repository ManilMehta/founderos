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
    <div className="min-h-screen bg-white">
      <nav className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-2xl font-bold tracking-tight">FOUNDEROS</h1>
            <form action={signOut}>
              <button className="text-sm hover:opacity-70 transition-opacity font-medium tracking-wide underline">
                SIGN OUT
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardClient 
          initialExperiments={experiments} 
          initialMetrics={metrics}
        />
      </main>
    </div>
  )
}