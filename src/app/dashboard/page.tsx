import { getSession } from '@/lib/auth'
import { getTodos, createTodo } from '@/app/actions/todo'
import { TodoCard } from '@/components/TodoCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const todos = await getTodos()
    const isAdmin = session.user.role === 'ADMIN'

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                    </h1>
                    <p className="text-gray-600 mt-2">Welcome back, <span className="font-semibold text-blue-600">@{session.user.username}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500 bg-gradient-to-br from-white to-blue-50">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900">Create New Todo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={createTodo} className="space-y-4">
                                <Input name="title" placeholder="What needs to be done?" required />
                                <textarea
                                    name="description"
                                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Description (optional)"
                                    rows={3}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Due Date</label>
                                        <Input type="date" name="dueDate" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Priority</label>
                                        <select
                                            name="priority"
                                            defaultValue="MEDIUM"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Add Todo</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-t-purple-500 bg-gradient-to-br from-white to-purple-50">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-900">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Total Todos</span>
                                <span className="text-lg font-bold text-blue-600">{todos.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Completed</span>
                                <span className="text-lg font-bold text-green-600">
                                    {todos.filter((t: any) => t.completed).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Pending</span>
                                <span className="text-lg font-bold text-orange-600">
                                    {todos.filter((t: any) => !t.completed).length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isAdmin ? 'All Todos' : 'My Todos'}
                        </h2>
                    </div>
                    {todos.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No todos yet. Create one to get started!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {todos.map((todo: any) => (
                                <TodoCard key={todo.id} todo={todo} isAdmin={isAdmin} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
