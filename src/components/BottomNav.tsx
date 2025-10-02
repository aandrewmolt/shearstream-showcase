import { Home, Activity, Download, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Activity, label: 'Monitor', path: '/dashboard/746' },
    { icon: Download, label: 'Export', path: '#export' },
    { icon: Settings, label: 'Settings', path: '#settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass border-t border-petroleum-600/20 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-petroleum-400 bg-petroleum-600/20'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-petroleum-600/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
