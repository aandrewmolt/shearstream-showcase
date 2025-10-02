import { Clock, Eye, EyeOff } from 'lucide-react'
import type { Channel } from '../data/job746'

interface ChartControlsProps {
  channels: readonly Channel[]
  visibleChannels: string[]
  onToggleChannel: (channelName: string) => void
  timeRange: string
  onTimeRangeChange: (range: string) => void
}

const TIME_RANGES = [
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: 'All', value: 'all' },
]

export default function ChartControls({
  channels,
  visibleChannels,
  onToggleChannel,
  timeRange,
  onTimeRangeChange,
}: ChartControlsProps) {
  return (
    <div className="glass rounded-xl p-6 md:p-8 border border-petroleum-600/20 space-y-6">
      {/* Time Range Selector - 8pt spacing */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-petroleum-400" />
          <span className="text-sm font-semibold text-petroleum-400 leading-none">Time Range</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                timeRange === range.value
                  ? 'bg-petroleum-600 text-white'
                  : 'bg-petroleum-600/10 text-gray-400 hover:bg-petroleum-600/20 hover:text-gray-300'
              }`}
            >
              <span className="leading-none">{range.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Channel Visibility Toggles - 8pt spacing */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-petroleum-400" />
          <span className="text-sm font-semibold text-petroleum-400 leading-none">Channels</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {channels.map((channel) => {
            const isVisible = visibleChannels.includes(channel.name)
            return (
              <button
                key={channel.name}
                onClick={() => onToggleChannel(channel.name)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isVisible
                    ? 'bg-petroleum-600/20 border border-petroleum-600/40'
                    : 'bg-petroleum-600/5 border border-petroleum-600/10 opacity-50'
                }`}
              >
                {isVisible ? (
                  <Eye className="w-4 h-4 flex-shrink-0" style={{ color: channel.color }} />
                ) : (
                  <EyeOff className="w-4 h-4 flex-shrink-0 text-gray-600" />
                )}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: channel.color }}
                />
                <span className="text-xs font-medium text-gray-300 truncate leading-none">
                  {channel.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
