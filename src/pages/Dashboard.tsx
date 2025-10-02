import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { Activity, Radio, TrendingUp } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useProjectJobs, useProjectHierarchy, useTimeseriesData } from '../hooks/useJobData'
import { job746 } from '../data/job746'
import JobSelector from '../components/JobSelector'
import Breadcrumb from '../components/Breadcrumb'
import ChartControls from '../components/ChartControls'
import TreatmentSummary from '../components/TreatmentSummary'
import UnifiedChart from '../components/charts/UnifiedChart'

const PROJECT_ID = 413

// Time range mapping (milliseconds)
const TIME_RANGES: Record<string, number> = {
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '4h': 4 * 60 * 60 * 1000,
  'All': 0, // 0 means fetch all available data
}

export default function Dashboard() {
  const { jobId } = useParams<{ jobId: string }>()
  const currentJobId = parseInt(jobId || '746')

  // Fetch job and hierarchy data
  const { data: jobs = [], isLoading: jobsLoading } = useProjectJobs(PROJECT_ID)
  const { data: hierarchy = [] } = useProjectHierarchy(PROJECT_ID)

  // Local state for controls
  const [timeRange, setTimeRange] = useState('15m')
  const [visibleChannels, setVisibleChannels] = useState<string[]>(
    job746.channels.filter((c) => c.visible).map((c) => c.name)
  )

  // Calculate time range for timeseries query
  const { startTimestamp, endTimestamp } = useMemo(() => {
    const now = Date.now()
    const rangeMs = TIME_RANGES[timeRange]
    return {
      startTimestamp: rangeMs === 0 ? undefined : now - rangeMs,
      endTimestamp: now,
    }
  }, [timeRange])

  // Fetch timeseries data with 2-second polling
  const {
    data: timeseriesData,
    isLoading: timeseriesLoading,
    error: timeseriesError,
  } = useTimeseriesData(
    currentJobId,
    visibleChannels,
    startTimestamp,
    endTimestamp,
    true // enable polling
  )

  // Get current job from API or fallback to static
  const currentJob = jobs.find((j) => j.id === currentJobId) || null

  function handleToggleChannel(channelName: string) {
    setVisibleChannels((prev) =>
      prev.includes(channelName)
        ? prev.filter((c) => c !== channelName)
        : [...prev, channelName]
    )
  }

  // Calculate stats from timeseries data
  const dataPointsCount = timeseriesData?.data?.length || 0

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-petroleum-600 border-t-petroleum-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading job data...</p>
        </div>
      </div>
    )
  }

  // Show error if timeseries fails to load
  if (timeseriesError) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="glass rounded-2xl p-8 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
            <p className="text-gray-400 mb-4">
              Unable to fetch timeseries data. This may be due to authentication or network issues.
            </p>
            <p className="text-sm text-gray-500">
              Error: {timeseriesError instanceof Error ? timeseriesError.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 pb-20 md:pb-0">
      {/* Header - 8pt vertical spacing, consistent horizontal alignment */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 glass border-b border-petroleum-600/20 backdrop-blur-lg"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 md:px-8 py-4 flex-wrap">
          <Breadcrumb hierarchy={hierarchy} />

          <div className="flex items-center gap-4 flex-1 justify-center md:justify-start">
            <div className="rounded-lg bg-petroleum-600/10 p-2.5">
              <Activity className="h-5 w-5 text-petroleum-500" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold text-white leading-none">
                {currentJob?.job?.publisher?.wellName || job746.companyName}
              </div>
              <div className="text-xs text-gray-400 leading-none">
                {currentJob ? `Job #${currentJob.id}` : job746.projectName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full glass px-4 py-2.5 border border-green-500/30">
            <div className="h-2 w-2 rounded-full bg-green-500 live-indicator shadow-lg shadow-green-500/50"></div>
            <span className="text-xs font-semibold text-green-400 leading-none">
              {currentJob?.state || 'LIVE'}
            </span>
          </div>
        </div>
      </motion.header>

      {/* Dashboard Content - 8pt grid system with consistent spacing */}
      <main className="mx-auto max-w-7xl px-6 md:px-8 py-8 md:py-12 space-y-8">
        {/* Job Selector & Info Card - Top priority in F-pattern */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8 glow-border"
        >
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <h1 className="mb-3 text-2xl md:text-3xl font-bold text-white leading-tight">
                Job #{currentJobId} -{' '}
                {currentJob?.job?.publisher?.wellName || job746.projectName}
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {job746.companyName}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              {jobs.length > 0 && <JobSelector jobs={jobs} currentJobId={currentJobId} />}
              <div className="flex items-center gap-2 rounded-lg bg-petroleum-600/20 px-4 py-2.5 border border-petroleum-600/30">
                <Radio className="h-4 w-4 text-petroleum-500 animate-pulse-slow" />
                <span className="text-sm font-semibold text-petroleum-400">Real-Time</span>
              </div>
            </div>
          </div>

          {/* KPI Cards - Perfectly centered content */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all border border-petroleum-600/20 flex flex-col items-center justify-center text-center min-h-[120px]"
            >
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3 leading-none">
                Active Channels
              </div>
              <div className="text-4xl font-bold gradient-text">
                <CountUp end={visibleChannels.length} duration={1.5} />
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all border border-petroleum-600/20 flex flex-col items-center justify-center text-center min-h-[120px]"
            >
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3 leading-none">
                Data Points
              </div>
              <div className="text-4xl font-bold gradient-text">
                {dataPointsCount > 0 ? (
                  <CountUp end={dataPointsCount} duration={1.5} />
                ) : timeseriesLoading ? (
                  <span className="text-gray-500">...</span>
                ) : (
                  <CountUp end={2400} duration={1.5} />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all border border-petroleum-600/20 col-span-2 md:col-span-1 flex flex-col items-center justify-center text-center min-h-[120px]"
            >
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3 leading-none">
                Refresh Rate
              </div>
              <div className="text-4xl font-bold gradient-text">
                <CountUp end={2} duration={1.5} suffix="s" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Treatment Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TreatmentSummary
            totalVolume={12547}
            totalProppant={245890}
            avgPressure={4650}
            currentStage={currentJob?.job?.publisher?.stage || '4'}
          />
        </motion.div>

        {/* Chart Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ChartControls
            channels={job746.channels}
            visibleChannels={visibleChannels}
            onToggleChannel={handleToggleChannel}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </motion.div>

        {/* Unified Chart - Professional WebGL-accelerated visualization */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <UnifiedChart
            data={timeseriesData?.data}
            visibleChannels={visibleChannels}
            height={600}
          />
        </motion.div>
      </main>
    </div>
  )
}
