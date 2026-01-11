'use client'

import { useState } from 'react'
import { submitExperimentResult } from '@/app/actions/experiments'
import type { Experiment } from '@/lib/types'

interface Props {
  experiment: Experiment
  onClose: () => void
}

export default function SubmitResultModal({ experiment, onClose }: Props) {
  const [observedValue, setObservedValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await submitExperimentResult({
      experiment_id: experiment.id,
      observed_value: parseFloat(observedValue)
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">SUBMIT RESULT</h2>
        
        <div className="mb-6 p-6 border-2 border-black">
          <h3 className="font-bold text-lg mb-2">{experiment.title}</h3>
          <p className="text-gray-700 text-sm mb-4">{experiment.hypothesis}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-bold text-xs tracking-wider mb-1">METRIC</div>
              <div>{experiment.metric_name}</div>
            </div>
            <div>
              <div className="font-bold text-xs tracking-wider mb-1">TARGET</div>
              <div>{experiment.target_value}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-wider mb-2">
              OBSERVED {experiment.metric_name.toUpperCase()}
            </label>
            <input
              type="number"
              step="any"
              value={observedValue}
              onChange={(e) => setObservedValue(e.target.value)}
              required
              className="input-field"
              placeholder="Enter actual result"
            />
            <p className="text-xs text-gray-600 mt-2">
              System will automatically determine ship or kill
            </p>
          </div>

          {error && (
            <div className="border-2 border-black p-3 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}