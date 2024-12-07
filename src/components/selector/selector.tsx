'use client'

import { useState } from 'react'

interface SelectorProps {
  statuses: string[]
  initialStatus?: string
  onChange?: (status: string) => void
}

const getStatusColor = (status: string, isSelected: boolean): string => {
  const statusColors: { [key: string]: string } = {
    Planned: 'bg-yellow-300',
    'In Progress': 'bg-blue-400',
    Completed: 'bg-green-400',
    Blocked: 'bg-red-400',
    Review: 'bg-purple-400',
    // Add more status/color mappings as needed
  }

  const priorityColors: { [key: string]: string } = {
    High: 'bg-red-600',
    Medium: 'bg-orange-500',
    Low: 'bg-green-400',
    // Add more priority/color mappings as needed
  }

  const baseColor = statusColors[status] || priorityColors[status] || 'bg-gray-400'
  return isSelected ? baseColor : `${baseColor} opacity-50`
}

export const Selector = ({ statuses, initialStatus, onChange }: SelectorProps) => {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || statuses[0])

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status)
    onChange?.(status)
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex space-x-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            className={`w-4 h-4 rounded-full ${
              getStatusColor(status, selectedStatus === status)
            } ${
              selectedStatus === status 
                ? 'ring-black dark:ring-white'
                : ''
            }`}
            aria-label={status}
          />
        ))}
      </div>
      <span className="text-sm text-foreground">{selectedStatus}</span>
    </div>
  )
}
