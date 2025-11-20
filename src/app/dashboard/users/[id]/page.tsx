import { getSession } from '@/lib/auth'
import { getTodosForUser } from '@/app/actions/todo'
import { TodoCard } from '@/components/TodoCard'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import db from '@/lib/db'

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    const { id } = await params
    const user = await db.user.findUnique({ where: { id } })
    if (!user) return <div>User not found</div>

    const todos = await getTodosForUser(id)
    const pendingTodos = todos.filter((t: any) => !t.completed)
    const completedTodos = todos.filter((t: any) => t.completed)

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/users">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Todos for <span className="text-blue-600">@{user.username}</span>
                    </h1>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Pending Column */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-orange-600 flex items-center gap-2">
                            Pending Tasks
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                                {pendingTodos.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {pendingTodos.length === 0 ? (
                                <p className="text-gray-500 italic">No pending tasks.</p>
                            ) : (
                                pendingTodos.map((todo: any) => (
                                    <TodoCard key={todo.id} todo={todo} isAdmin={true} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                            Completed Tasks
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                {completedTodos.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {completedTodos.length === 0 ? (
                                <p className="text-gray-500 italic">No completed tasks.</p>
                            ) : (
                                completedTodos.map((todo: any) => (
                                    <TodoCard key={todo.id} todo={todo} isAdmin={true} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
