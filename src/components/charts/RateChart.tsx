import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { job746 } from '../../data/job746'
import type { TimeseriesDataPoint } from '../../services/api'
import ValueDisplay from '../ValueDisplay'

interface RateChartProps {
  data?: TimeseriesDataPoint[]
  visibleChannels?: string[]
}

export default function RateChart({ data, visibleChannels }: RateChartProps) {
  const rateChannels = useMemo(() => {
    const channels = job746.channels.filter((ch) => ch.yAxis === 'rate')

    if (visibleChannels) {
      return channels.filter((ch) => visibleChannels.includes(ch.name))
    }

    return channels.filter((ch) => ch.visible)
  }, [visibleChannels])

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate mock data for development
      return Array.from({ length: 60 }, (_, i) => {
        const baseTime = Date.now() - 120000
        return {
          time: new Date(baseTime + i * 2000).toLocaleTimeString(),
          'Slurry Rate': 55 + Math.random() * 10 + Math.sin(i / 8) * 5,
          'Calc Clean Rate': 52 + Math.random() * 8 + Math.cos(i / 10) * 4,
        }
      })
    }

    return data.map((point) => {
      const transformed: Record<string, string | number> = {
        time: new Date(point.timestamp).toLocaleTimeString(),
      }

      rateChannels.forEach((channel) => {
        if (point[channel.name] !== undefined) {
          transformed[channel.title] = point[channel.name]
        }
      })

      return transformed
    })
  }, [data, rateChannels])

  return (
    <div className="glass rounded-2xl p-6 border border-petroleum-600/20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white leading-none mb-2">Flow Rate Analysis</h2>
          <p className="text-sm text-gray-400 leading-none">Real-time flow rate data (bpm)</p>
        </div>
        <div className="flex items-center gap-2 rounded-full glass px-4 py-2 border border-green-500/30">
          <div className="h-2 w-2 rounded-full bg-green-500 live-indicator shadow-lg shadow-green-500/50"></div>
          <span className="text-xs font-semibold text-green-400 leading-none">
            {data && data.length > 0 ? 'LIVE' : 'MOCK DATA'}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="#a1a1aa"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#a1a1aa' }}
          />
          <YAxis
            stroke="#a1a1aa"
            style={{ fontSize: '12px' }}
            domain={[40, 75]}
            tick={{ fill: '#a1a1aa' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(24, 24, 27, 0.95)',
              border: '1px solid rgba(226, 104, 21, 0.3)',
              borderRadius: '0.75rem',
              padding: '12px',
              backdropFilter: 'blur(10px)',
            }}
            labelStyle={{ color: '#e26815', fontWeight: 600, marginBottom: '8px' }}
            itemStyle={{ color: '#fafafa', padding: '4px 0' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => <span style={{ color: '#d4d4d8', fontSize: '13px' }}>{value}</span>}
          />
          {rateChannels.map((channel) => (
            <Line
              key={channel.name}
              type="monotone"
              dataKey={channel.title}
              stroke={channel.color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 6, strokeWidth: 2, fill: channel.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Real-Time Value Display */}
      {data && data.length > 0 && <ValueDisplay data={data} channels={rateChannels} />}
    </div>
  )
}
