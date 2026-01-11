'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CreateExperimentInput, SubmitResultInput, ExperimentStatus } from '@/lib/types'

export async function createExperiment(input: CreateExperimentInput) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Insert experiment
  const { data, error } = await supabase
    .from('experiments')
    .insert({
      user_id: user.id,
      title: input.title,
      hypothesis: input.hypothesis,
      metric_name: input.metric_name,
      target_value: input.target_value,
      status: 'active'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data }
}

export async function submitExperimentResult(input: SubmitResultInput) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Get the experiment to determine outcome
  const { data: experiment, error: fetchError } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', input.experiment_id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !experiment) {
    return { error: 'Experiment not found' }
  }

  // Decision engine: compare observed vs target
  const status: ExperimentStatus = input.observed_value >= experiment.target_value 
    ? 'shipped' 
    : 'killed'

  // Update experiment with result
  const { data, error } = await supabase
    .from('experiments')
    .update({
      observed_value: input.observed_value,
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', input.experiment_id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { data }
}

export async function deleteExperiment(experimentId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('experiments')
    .delete()
    .eq('id', experimentId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getExperiments() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { experiments: [], metrics: null }
  }

  const { data: experiments, error } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { experiments: [], metrics: null }
  }

  // Calculate metrics
  const total = experiments.length
  const shipped = experiments.filter(e => e.status === 'shipped').length
  const killed = experiments.filter(e => e.status === 'killed').length
  const active = experiments.filter(e => e.status === 'active').length

  const metrics = {
    total,
    shipped,
    killed,
    active,
    shippedPercentage: total > 0 ? Math.round((shipped / total) * 100) : 0,
    killedPercentage: total > 0 ? Math.round((killed / total) * 100) : 0
  }

  return { experiments, metrics }
}