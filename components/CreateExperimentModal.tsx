'use client'

import { useState } from 'react'
import { createExperiment } from '@/app/actions/experiments'

interface Props {
  onClose: () => void
}

export default function CreateExperimentModal({ onClose }: Props) {
  const [title, setTitle] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [metricName, setMetricName] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await createExperiment({
      title,
      hypothesis,
      metric_name: metricName,
      target_value: parseFloat(targetValue)
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
        <h2 className="text-2xl font-bold mb-6 tracking-tight">CREATE EXPERIMENT</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-wider mb-2">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="Launch landing page"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider mb-2">
              HYPOTHESIS
            </label>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              required
              rows={3}
              className="input-field resize-none"
              placeholder="If we launch a landing page, we will get 100 signups in 2 weeks"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider mb-2">
              METRIC NAME
            </label>
            <input
              type="text"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              required
              className="input-field"
              placeholder="Signups"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider mb-2">
              TARGET VALUE
            </label>
            <input
              type="number"
              step="any"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              required
              className="input-field"
              placeholder="100"
            />
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
              {loading ? 'CREATING...' : 'CREATE'}
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