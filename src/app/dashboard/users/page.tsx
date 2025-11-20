import { getSession } from '@/lib/auth'
import { getUsers } from '@/app/actions/user'
import { UserList } from '@/components/UserList'
import { Button } from '@/components/ui/Button'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function UsersPage() {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    const users = await getUsers()

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                </div>

                <UserList users={users} />
            </div>
        </div>
    )
}
