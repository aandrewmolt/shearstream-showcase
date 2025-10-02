import { motion } from 'framer-motion'
import { Droplets, Package, Gauge, Activity } from 'lucide-react'
import CountUp from 'react-countup'

interface TreatmentSummaryProps {
  totalVolume: number
  totalProppant: number
  avgPressure: number
  currentStage: string
}

export default function TreatmentSummary({
  totalVolume,
  totalProppant,
  avgPressure,
  currentStage,
}: TreatmentSummaryProps) {
  const stats = [
    {
      icon: Droplets,
      label: 'Total Volume',
      value: totalVolume,
      suffix: ' bbl',
      color: 'text-blue-400',
    },
    {
      icon: Package,
      label: 'Total Proppant',
      value: totalProppant,
      suffix: ' lbs',
      color: 'text-amber-400',
    },
    {
      icon: Gauge,
      label: 'Avg Pressure',
      value: avgPressure,
      suffix: ' psi',
      color: 'text-red-400',
    },
    {
      icon: Activity,
      label: 'Current Stage',
      value: parseInt(currentStage) || 0,
      suffix: '',
      color: 'text-green-400',
    },
  ]

  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-petroleum-600/20">
      <h3 className="text-lg font-bold text-petroleum-400 mb-6">Treatment Summary</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-50/50 rounded-xl p-5 border border-petroleum-600/10 flex flex-col items-center justify-center text-center min-h-[140px]"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-gray-400 font-medium leading-none">{stat.label}</span>
            </div>
            <div className={`text-3xl font-bold ${stat.color} text-center`}>
              <CountUp end={stat.value} duration={2} separator="," suffix={stat.suffix} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
