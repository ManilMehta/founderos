'use client'

import { useState } from 'react'
import type { Experiment } from '@/lib/types'
import CreateExperimentModal from './CreateExperimentModal'
import SubmitResultModal from './SubmitResultModal'
import { deleteExperiment } from '@/app/actions/experiments'

interface Props {
  initialExperiments: Experiment[]
  initialMetrics: any
}

export default function DashboardClient({ initialExperiments, initialMetrics }: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this experiment?')) {
      await deleteExperiment(id)
    }
  }

  function openResultModal(experiment: Experiment) {
    setSelectedExperiment(experiment)
    setShowResultModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Metrics */}
      {initialMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="Total Experiments" value={initialMetrics.total} />
          <MetricCard 
            label="Shipped" 
            value={`${initialMetrics.shipped} (${initialMetrics.shippedPercentage}%)`}
            color="green" 
          />
          <MetricCard 
            label="Killed" 
            value={`${initialMetrics.killed} (${initialMetrics.killedPercentage}%)`}
            color="red" 
          />
          <MetricCard label="Active" value={initialMetrics.active} color="blue" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Experiments</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          New Experiment
        </button>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {initialExperiments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No experiments yet. Create one to get started.</p>
          </div>
        ) : (
          initialExperiments.map(exp => (
            <div key={exp.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    <StatusBadge status={exp.status} />
                  </div>
                  <p className="text-gray-600 mt-2">{exp.hypothesis}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Metric:</span>{' '}
                      <span className="font-medium">{exp.metric_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>{' '}
                      <span className="font-medium">{exp.target_value}</span>
                    </div>
                    {exp.observed_value !== null && (
                      <>
                        <div>
                          <span className="text-gray-500">Observed:</span>{' '}
                          <span className="font-medium">{exp.observed_value}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {exp.status === 'active' && (
                    <button
                      onClick={() => openResultModal(exp)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Submit Result
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateExperimentModal onClose={() => setShowCreateModal(false)} />
      )}
      {showResultModal && selectedExperiment && (
        <SubmitResultModal 
          experiment={selectedExperiment}
          onClose={() => {
            setShowResultModal(false)
            setSelectedExperiment(null)
          }}
        />
      )}
    </div>
  )
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  const colorClass = color === 'green' ? 'text-green-600' :
                     color === 'red' ? 'text-red-600' :
                     color === 'blue' ? 'text-blue-600' : 'text-gray-900'
  
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-2xl font-bold mt-2 ${colorClass}`}>{value}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: 'bg-blue-100 text-blue-800',
    shipped: 'bg-green-100 text-green-800',
    killed: 'bg-red-100 text-red-800'
  }
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status.toUpperCase()}
    </span>
  )
}