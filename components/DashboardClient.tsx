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
    if (confirm('Delete this experiment?')) {
      await deleteExperiment(id)
    }
  }

  function openResultModal(experiment: Experiment) {
    setSelectedExperiment(experiment)
    setShowResultModal(true)
  }

  return (
    <div className="space-y-12">
      {/* Metrics */}
      {initialMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="TOTAL" value={initialMetrics.total} />
          <MetricCard 
            label="SHIPPED" 
            value={`${initialMetrics.shipped}`}
            subtext={`${initialMetrics.shippedPercentage}%`}
          />
          <MetricCard 
            label="KILLED" 
            value={`${initialMetrics.killed}`}
            subtext={`${initialMetrics.killedPercentage}%`}
          />
          <MetricCard label="ACTIVE" value={initialMetrics.active} />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">EXPERIMENTS</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          NEW EXPERIMENT
        </button>
      </div>

      {/* Experiments List */}
      <div className="space-y-6">
        {initialExperiments.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 text-lg">No experiments yet.</p>
            <p className="text-gray-400 text-sm mt-2">Create one to get started.</p>
          </div>
        ) : (
          initialExperiments.map(exp => (
            <div key={exp.id} className="card">
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-bold tracking-tight">{exp.title}</h3>
                    <StatusBadge status={exp.status} />
                  </div>
                  <p className="text-gray-700 mb-6">{exp.hypothesis}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-xs tracking-wider mb-1">METRIC</div>
                      <div>{exp.metric_name}</div>
                    </div>
                    <div>
                      <div className="font-bold text-xs tracking-wider mb-1">TARGET</div>
                      <div>{exp.target_value}</div>
                    </div>
                    {exp.observed_value !== null && (
                      <div>
                        <div className="font-bold text-xs tracking-wider mb-1">OBSERVED</div>
                        <div>{exp.observed_value}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {exp.status === 'active' && (
                    <button
                      onClick={() => openResultModal(exp)}
                      className="btn-secondary text-xs px-4 py-2"
                    >
                      SUBMIT
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="btn-danger"
                  >
                    DELETE
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

function MetricCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <div className="card">
      <div className="text-xs font-bold tracking-wider mb-2">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {subtext && <div className="text-sm text-gray-600 mt-1">{subtext}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-white border-black text-black',
    shipped: 'bg-black border-black text-white',
    killed: 'bg-white border-black text-black'
  }
  
  return (
    <span className={`badge ${styles[status as keyof typeof styles]}`}>
      {status.toUpperCase()}
    </span>
  )
}