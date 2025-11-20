'use client'

import { useEffect, useState } from 'react'
import { getTodoLogs } from '@/app/actions/todo'
import { Clock, AlertCircle, CheckCircle2, RotateCcw, Edit, Calendar, Flag } from 'lucide-react'

interface TodoLog {
    id: string
    action: string
    details: string | null
    createdAt: Date
    userId: string
}

interface ActivityLogProps {
    todoId: string
}

export function ActivityLog({ todoId }: ActivityLogProps) {
    const [logs, setLogs] = useState<TodoLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLogs() {
            const data = await getTodoLogs(todoId)
            setLogs(data as TodoLog[])
            setLoading(false)
        }
        fetchLogs()
    }, [todoId])

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATED': return <AlertCircle size={14} className="text-blue-500" />
            case 'COMPLETED': return <CheckCircle2 size={14} className="text-green-500" />
            case 'REOPENED': return <RotateCcw size={14} className="text-orange-500" />
            case 'UPDATED': return <Edit size={14} className="text-gray-500" />
            case 'DUE_DATE_EXTENDED': return <Calendar size={14} className="text-purple-500" />
            case 'PRIORITY_CHANGED': return <Flag size={14} className="text-red-500" />
            default: return <Clock size={14} className="text-gray-400" />
        }
    }

    const formatAction = (action: string, details: string | null) => {
        try {
            const data = details ? JSON.parse(details) : {}

            switch (action) {
                case 'CREATED':
                    return `Created with priority: ${data.priority || 'MEDIUM'}`
                case 'COMPLETED':
                    return 'Marked as completed'
                case 'REOPENED':
                    return 'Reopened'
                case 'DUE_DATE_EXTENDED':
                    return `Due date extended by ${data.extended}`
                case 'PRIORITY_CHANGED':
                    return `Priority changed from ${data.priority?.from} to ${data.priority?.to}`
                case 'UPDATED':
                    const changes = []
                    if (data.title) changes.push('title')
                    if (data.description !== undefined) changes.push('description')
                    if (data.dueDate) changes.push('due date')
                    return `Updated ${changes.join(', ')}`
                default:
                    return action.toLowerCase().replace(/_/g, ' ')
            }
        } catch {
            return action.toLowerCase().replace(/_/g, ' ')
        }
    }

    if (loading) {
        return <div className="text-xs text-gray-400">Loading activity...</div>
    }

    if (logs.length === 0) {
        return <div className="text-xs text-gray-400">No activity yet</div>
    }

    return (
        <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Activity Log</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-xs">
                        <div className="mt-0.5">{getActionIcon(log.action)}</div>
                        <div className="flex-1">
                            <p className="text-gray-700">{formatAction(log.action, log.details)}</p>
                            <p className="text-gray-400 text-[10px]">
                                {new Date(log.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
