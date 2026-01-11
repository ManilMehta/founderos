import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight hover:opacity-70 transition-opacity">
              FOUNDEROS
            </h1>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}