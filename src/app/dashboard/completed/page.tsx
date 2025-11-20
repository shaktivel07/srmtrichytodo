import { getTodos } from '@/app/actions/todo'
import { TodoCard } from '@/components/TodoCard'
import { PriorityFilter } from '@/components/PriorityFilter'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CompletedPage({
    searchParams,
}: {
    searchParams: Promise<{ priority?: string }>
}) {
    const session = await getSession()
    if (!session) redirect('/login')

    const params = await searchParams
    const isAdmin = session.user.role === 'ADMIN'
    const allTodos = await getTodos()

    // Filter for completed todos
    let todos = allTodos.filter((todo: any) => todo.completed)

    // Apply priority filter if selected
    if (params.priority) {
        todos = todos.filter((todo: any) => todo.priority === params.priority)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Completed Todos</h1>
                <PriorityFilter />
            </div>

            <div className="text-sm text-gray-600">
                Showing {todos.length} completed todo{todos.length !== 1 ? 's' : ''}
                {params.priority && ` with ${params.priority} priority`}
            </div>

            {todos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No completed todos found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {todos.map((todo: any) => (
                        <TodoCard key={todo.id} todo={todo} isAdmin={isAdmin} />
                    ))}
                </div>
            )}
        </div>
    )
}
