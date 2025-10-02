import { motion } from 'framer-motion'
import { ChevronDown, Activity, CheckCircle2, Pause, Square } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Job } from '../services/api'
import { useNavigate } from 'react-router-dom'

interface JobSelectorProps {
  jobs: Job[]
  currentJobId: number
}

function getJobStateIcon(state: Job['state']) {
  switch (state) {
    case 'RUNNING':
      return <Activity className="w-4 h-4 text-green-500" />
    case 'COMPLETED':
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />
    case 'PAUSED':
      return <Pause className="w-4 h-4 text-yellow-500" />
    case 'STOPPED':
      return <Square className="w-4 h-4 text-red-500" />
    default:
      return <Activity className="w-4 h-4 text-gray-500" />
  }
}

function getJobStateBadge(state: Job['state']) {
  const colors = {
    RUNNING: 'bg-green-500/20 text-green-400 border-green-500/30',
    COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PAUSED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    STOPPED: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[state] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}
    >
      {state}
    </span>
  )
}

export default function JobSelector({ jobs, currentJobId }: JobSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const currentJob = jobs.find((j) => j.id === currentJobId)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleJobSelect(jobId: number) {
    navigate(`/dashboard/${jobId}`)
    setIsOpen(false)
  }

  if (!currentJob) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-petroleum-600/20 hover:border-petroleum-500/40 transition-all group"
      >
        <div className="flex items-center gap-2">
          {getJobStateIcon(currentJob.state)}
          <div className="text-left">
            <div className="text-sm font-semibold text-white">Job #{currentJob.id}</div>
            <div className="text-xs text-gray-400">
              Stage {currentJob.job.publisher.stage} • {currentJob.job.publisher.wellName}
            </div>
          </div>
        </div>
        {getJobStateBadge(currentJob.state)}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-80 glass rounded-xl border border-petroleum-600/20 overflow-hidden z-50 max-h-96 overflow-y-auto"
        >
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => handleJobSelect(job.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-petroleum-600/10 transition-colors border-b border-petroleum-600/10 last:border-b-0 ${
                job.id === currentJobId ? 'bg-petroleum-600/20' : ''
              }`}
            >
              {getJobStateIcon(job.state)}
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-white">Job #{job.id}</div>
                <div className="text-xs text-gray-400">
                  Stage {job.job.publisher.stage} • {job.job.publisher.wellName}
                </div>
              </div>
              {getJobStateBadge(job.state)}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
