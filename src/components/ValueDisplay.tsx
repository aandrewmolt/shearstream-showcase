import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { TimeseriesDataPoint } from '../services/api'
import type { Channel } from '../data/job746'

interface ValueDisplayProps {
  data?: TimeseriesDataPoint[]
  channels: Channel[]
}

export default function ValueDisplay({ data, channels }: ValueDisplayProps) {
  // Get the latest data point for current values
  const latestPoint = data && data.length > 0 ? data[data.length - 1] : null

  // If no data, don't render anything
  if (!latestPoint || channels.length === 0) {
    return null
  }

  // Calculate trend for each channel (compare last vs previous point)
  const getTrend = (channelName: string): 'up' | 'down' | 'stable' => {
    if (!data || data.length < 2) return 'stable'

    const current = latestPoint[channelName]
    const previous = data[data.length - 2][channelName]

    if (current === undefined || previous === undefined) return 'stable'

    const diff = Math.abs(current - previous)
    const threshold = current * 0.01 // 1% change threshold

    if (diff < threshold) return 'stable'
    return current > previous ? 'up' : 'down'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {channels.map((channel) => {
        const value = latestPoint[channel.name]
        if (value === undefined) return null

        const trend = getTrend(channel.name)
        const TrendIcon =
          trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

        return (
          <motion.div
            key={channel.name}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl p-4 border hover:bg-white/5 transition-all"
            style={{
              borderColor: `${channel.color}40`,
              backgroundColor: `${channel.color}08`,
            }}
          >
            {/* Channel Name */}
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: `${channel.color}dd` }}
              >
                {channel.title}
              </p>
              <TrendIcon
                className="w-3 h-3"
                style={{
                  color:
                    trend === 'up'
                      ? '#10b981'
                      : trend === 'down'
                      ? '#ef4444'
                      : '#6b7280',
                }}
              />
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span
                className="text-3xl font-bold leading-none"
                style={{ color: channel.color }}
              >
                {typeof value === 'number' ? value.toFixed(channel.digits || 2) : value}
              </span>
              <span className="text-xs text-gray-500 leading-none">{channel.unit}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
