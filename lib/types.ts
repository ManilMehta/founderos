export type ExperimentStatus = 'active' | 'shipped' | 'killed'

export interface Experiment {
  id: string
  user_id: string
  title: string
  hypothesis: string
  metric_name: string
  target_value: number
  observed_value: number | null
  status: ExperimentStatus
  result_summary: string | null
  created_at: string
  updated_at: string
}

export interface CreateExperimentInput {
  title: string
  hypothesis: string
  metric_name: string
  target_value: number
}

export interface SubmitResultInput {
  experiment_id: string
  observed_value: number
}