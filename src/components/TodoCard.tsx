'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { deleteTodo, toggleTodo, updateTodo } from '@/app/actions/todo'
import { Check, Trash2, Edit2, X, Save, Calendar, Flag } from 'lucide-react'
import { ActivityLog } from './ActivityLog'

interface TodoProps {
    todo: {
        id: string
        title: string
        description: string | null
        completed: boolean
        priority: string
        dueDate: Date | null
        user?: { username: string }
        creator?: { username: string }
        isAdminCreated?: boolean
    }
    isAdmin?: boolean
}

export function TodoCard({ todo, isAdmin }: TodoProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [showLogs, setShowLogs] = useState(false)
    const [title, setTitle] = useState(todo.title)
    const [description, setDescription] = useState(todo.description || '')
    const [priority, setPriority] = useState(todo.priority)
    const [dueDate, setDueDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '')

    const handleToggle = async () => {
        await toggleTodo(todo.id)
    }

    const handleDelete = async () => {
        if (confirm('Are you sure?')) {
            await deleteTodo(todo.id)
        }
    }

    const handleSave = async () => {
        await updateTodo(todo.id, {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null
        })
        setIsEditing(false)
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

    return (
        <Card className={`w-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${todo.completed
            ? 'opacity-75 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
            : isOverdue
                ? 'border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg shadow-red-100'
                : 'bg-gradient-to-br from-white to-blue-50 border-l-4 border-l-blue-500 shadow-md'
            }`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-bold text-lg mb-2 border-2 border-blue-300 focus:border-blue-500"
                            />
                        ) : (
                            <CardTitle className={`text-lg font-bold ${todo.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                                }`}>
                                {todo.title}
                            </CardTitle>
                        )}

                    </div>

                    <div className="flex gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleToggle}
                            className={`transition-all duration-300 ${todo.completed
                                ? 'text-green-600 bg-green-50 hover:bg-green-100'
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                }`}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                        >
                            {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {todo.user && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                            by <span className="font-semibold text-blue-600">@{todo.user.username}</span>
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border-2 transition-all duration-300 hover:scale-105 ${getPriorityColor(todo.priority)}`}>
                            <Flag size={10} className="animate-pulse" />
                            {todo.priority}
                        </span>
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline font-medium transition-all duration-300"
                        >
                            {showLogs ? '🔽 Hide' : '🔼 Show'} Activity
                        </button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={3}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{todo.description}</p>
                        {todo.dueDate && (
                            <div className={`flex items-center gap-1 text-xs mt-2 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                <Calendar className="h-3 w-3" />
                                {new Date(todo.dueDate).toLocaleDateString()}
                                {isOverdue && " (Overdue)"}
                            </div>
                        )}
                    </>
                )}
                {showLogs && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <ActivityLog todoId={todo.id} />
                    </div>
                )}
            </CardContent>
            {
                isEditing && (
                    <CardFooter>
                        <Button onClick={handleSave} size="sm" className="w-full">
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                        </Button>
                    </CardFooter>
                )
            }
        </Card >
    )
}
