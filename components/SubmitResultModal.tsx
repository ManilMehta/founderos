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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Submit Result</h2>
        
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">{experiment.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{experiment.hypothesis}</p>
          <div className="mt-3 text-sm">
            <div>
              <span className="text-gray-500">Metric:</span>{' '}
              <span className="font-medium">{experiment.metric_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Target:</span>{' '}
              <span className="font-medium">{experiment.target_value}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observed {experiment.metric_name}
            </label>
            <input
              type="number"
              step="any"
              value={observedValue}
              onChange={(e) => setObservedValue(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter actual result"
            />
            <p className="text-xs text-gray-500 mt-1">
              The system will automatically determine if this experiment should be shipped or killed
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}