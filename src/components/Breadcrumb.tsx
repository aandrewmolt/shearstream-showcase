import { ChevronRight } from 'lucide-react'
import type { HierarchyItem } from '../services/api'

interface BreadcrumbProps {
  hierarchy: HierarchyItem[]
}

export default function Breadcrumb({ hierarchy }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {hierarchy.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-600" />}
          <span
            className={`${
              index === hierarchy.length - 1
                ? 'text-petroleum-400 font-semibold'
                : 'text-gray-400'
            }`}
          >
            {item.title || item.assetType}
          </span>
        </div>
      ))}
    </nav>
  )
}
