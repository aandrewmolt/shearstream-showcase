import { useEffect, useRef, useState } from 'react'
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EAutoRange,
  ZoomPanModifier,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  EAxisAlignment,
  EllipsePointMarker,
  RolloverModifier,
  CursorModifier,
  SciChartJsNavyTheme,
} from 'scichart'
import type { TimeseriesDataPoint } from '../../services/api'
import { job746 } from '../../data/job746'
import ValueDisplay from '../ValueDisplay'

// Use the inferred type from job746.channels
type Channel = typeof job746.channels[number]

interface UnifiedChartProps {
  data?: TimeseriesDataPoint[]
  visibleChannels?: string[]
  height?: number
}

export default function UnifiedChart({ data, visibleChannels, height = 500 }: UnifiedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const sciChartSurfaceRef = useRef<SciChartSurface | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [chartData, setChartData] = useState<TimeseriesDataPoint[]>([])

  // Filter channels based on visibility
  const activeChannels: Channel[] = visibleChannels
    ? job746.channels.filter((ch: Channel) => visibleChannels.includes(ch.name))
    : job746.channels.filter((ch: Channel) => ch.visible)

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current || isInitialized) return

      // Set the license key (Community Edition)
      // SciChart.setRuntimeLicenseKey('YOUR_LICENSE_KEY_HERE')

      try {
        // Create the chart surface
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(chartRef.current, {
          theme: new SciChartJsNavyTheme(),
        })

        // Create X Axis (time)
        const xAxis = new NumericAxis(wasmContext, {
          axisTitle: 'Time (seconds)',
          autoRange: EAutoRange.Always,
          drawMajorGridLines: true,
          drawMinorGridLines: false,
          axisTitleStyle: { fontSize: 14, color: '#94A3B8' },
          labelStyle: { fontSize: 12, color: '#94A3B8' },
          majorGridLineStyle: { color: '#1E293B', strokeThickness: 1 },
        })
        sciChartSurface.xAxes.add(xAxis)

        // Create Y Axes for different measurement types
        const pressureAxis = new NumericAxis(wasmContext, {
          id: 'pressure',
          axisTitle: 'Pressure (psi)',
          axisAlignment: EAxisAlignment.Left,
          autoRange: EAutoRange.Always,
          axisTitleStyle: { fontSize: 14, color: '#EF4444' },
          labelStyle: { fontSize: 12, color: '#EF4444' },
          drawMajorGridLines: false,
        })
        sciChartSurface.yAxes.add(pressureAxis)

        const rateAxis = new NumericAxis(wasmContext, {
          id: 'rate',
          axisTitle: 'Rate (bbl/min)',
          axisAlignment: EAxisAlignment.Left,
          autoRange: EAutoRange.Always,
          axisTitleStyle: { fontSize: 14, color: '#3B82F6' },
          labelStyle: { fontSize: 12, color: '#3B82F6' },
          drawMajorGridLines: false,
        })
        sciChartSurface.yAxes.add(rateAxis)

        const concentrationAxis = new NumericAxis(wasmContext, {
          id: 'concentration',
          axisTitle: 'Concentration (ppg)',
          axisAlignment: EAxisAlignment.Right,
          autoRange: EAutoRange.Always,
          axisTitleStyle: { fontSize: 14, color: '#10B981' },
          labelStyle: { fontSize: 12, color: '#10B981' },
          drawMajorGridLines: false,
        })
        sciChartSurface.yAxes.add(concentrationAxis)

        // Add data series for each channel
        activeChannels.forEach((channel: Channel) => {
          const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: channel.title,
          })

          const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: channel.color,
            strokeThickness: 2,
            yAxisId: channel.yAxis,
            pointMarker: new EllipsePointMarker(wasmContext, {
              width: 3,
              height: 3,
              fill: channel.color,
              strokeThickness: 0,
            }),
          })

          sciChartSurface.renderableSeries.add(lineSeries)
        })

        // Add interactivity modifiers
        sciChartSurface.chartModifiers.add(
          new ZoomPanModifier(), // Left mouse drag to pan
          new MouseWheelZoomModifier(), // Mouse wheel to zoom
          new ZoomExtentsModifier(), // Double-click to zoom to fit
          new RolloverModifier({
            // Hover to see values
            showTooltip: true,
            showRolloverLine: true,
          }),
          new CursorModifier() // Crosshair cursor
        )

        sciChartSurfaceRef.current = sciChartSurface
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing SciChart:', error)
      }
    }

    initChart()

    return () => {
      // Cleanup
      sciChartSurfaceRef.current?.delete()
      sciChartSurfaceRef.current = null
      setIsInitialized(false)
    }
  }, []) // Only run once on mount

  // Update data when it changes
  useEffect(() => {
    if (!sciChartSurfaceRef.current || !isInitialized) return

    const updateData = () => {
      const chartData = data && data.length > 0 ? data : generateMockData()
      setChartData(chartData)

      // Update each series with new data
      sciChartSurfaceRef.current?.renderableSeries.asArray().forEach((series, index) => {
        const channel = activeChannels[index]
        if (!channel) return

        const dataSeries = series.dataSeries as XyDataSeries

        // Clear existing data
        dataSeries.clear()

        // Add new data points
        chartData.forEach((point: TimeseriesDataPoint, i: number) => {
          const value = point[channel.name]
          if (value !== undefined) {
            dataSeries.append(i, value)
          }
        })
      })

      // Zoom to fit data
      sciChartSurfaceRef.current?.zoomExtents()
    }

    updateData()
  }, [data, activeChannels, isInitialized])

  // Generate mock data for development
  const generateMockData = (): TimeseriesDataPoint[] => {
    return Array.from({ length: 100 }, (_, i) => {
      const point: TimeseriesDataPoint = {
        timestamp: Date.now() - (100 - i) * 2000,
      }

      activeChannels.forEach((channel: Channel) => {
        const baseValue = channel.name.toLowerCase().includes('pressure')
          ? 5000
          : channel.name.toLowerCase().includes('rate')
            ? 40
            : 8

        const variance = baseValue * 0.2
        point[channel.name] = baseValue + (Math.random() - 0.5) * variance
      })

      return point
    })
  }

  const isRealData = data && data.length > 0

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
          <div>
            <h3 className="text-lg font-semibold leading-none text-white">Unified Chart</h3>
            <p className="mt-1 text-sm leading-none text-slate-400">
              All channels in real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRealData ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/20 px-3 py-1.5 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-xs font-medium text-green-400">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-orange-500/20 px-3 py-1.5 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-xs font-medium text-orange-400">MOCK DATA</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div
        className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm"
        style={{ height: `${height}px` }}
      >
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Value Display */}
      {isRealData && <ValueDisplay data={chartData} channels={activeChannels} />}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm">
        {activeChannels.map((channel: Channel) => (
          <div key={channel.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: channel.color }}
            />
            <span className="text-sm font-medium text-slate-300">{channel.title}</span>
            <span className="text-xs text-slate-500">({channel.unit})</span>
          </div>
        ))}
      </div>

      {/* Controls Info */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 backdrop-blur-sm">
        <h4 className="mb-2 text-sm font-semibold text-white">Chart Controls</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 md:grid-cols-4">
          <div>
            <span className="font-medium text-slate-300">Pan:</span> Left-click + Drag
          </div>
          <div>
            <span className="font-medium text-slate-300">Zoom:</span> Mouse Wheel
          </div>
          <div>
            <span className="font-medium text-slate-300">Zoom to Fit:</span> Double-click
          </div>
          <div>
            <span className="font-medium text-slate-300">Inspect:</span> Hover over chart
          </div>
        </div>
      </div>
    </div>
  )
}
