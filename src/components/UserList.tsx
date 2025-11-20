'use client'

import { useState } from 'react'
import { createUser } from '@/app/actions/user'
import { createTodo } from '@/app/actions/todo'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Plus, X } from 'lucide-react'
import Link from 'next/link'

interface User {
    id: string
    username: string
    role: string
    _count: { todos: number }
}

export function UserList({ users }: { users: User[] }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER')
    const [error, setError] = useState('')
    const [assigningTo, setAssigningTo] = useState<string | null>(null)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        formData.append('role', role)

        const res = await createUser(formData)
        if (res?.error) {
            setError(res.error)
        } else {
            setUsername('')
            setPassword('')
        }
    }

    const handleAssignTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!assigningTo) return

        const formData = new FormData(e.currentTarget)
        formData.append('userId', assigningTo)

        await createTodo(formData)
        setAssigningTo(null)
    }

    return (
        <div className="space-y-6">
            {/* Assign Todo Modal */}
            {assigningTo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Assign Todo to User</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setAssigningTo(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAssignTodo} className="space-y-4">
                                <Input name="title" placeholder="Task title" required />
                                <textarea
                                    name="description"
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                                    placeholder="Description"
                                    rows={3}
                                />
                                <Input type="date" name="dueDate" />
                                <Button type="submit" className="w-full">Assign Task</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-32 space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <Button type="submit">Create</Button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id}>
                        <CardHeader>
                            <CardTitle className="text-base flex justify-between items-center">
                                @{user.username}
                                <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user.role}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center gap-2">
                                <p className="text-sm text-gray-500">Todos: {user._count.todos}</p>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/users/${user.id}`}>
                                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="outline" onClick={() => setAssigningTo(user.id)}>
                                        <Plus className="h-3 w-3 mr-1" /> Assign Todo
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
