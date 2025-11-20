'use client'

import { Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function PriorityFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentPriority = searchParams.get('priority') || ''

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('priority', value)
        } else {
            params.delete('priority')
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentPriority}
                onChange={(e) => handleChange(e.target.value)}
            >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
            </select>
        </div>
    )
}
