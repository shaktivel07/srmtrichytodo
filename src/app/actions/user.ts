'use server'

import { getSession, hashPassword } from '@/lib/auth'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return { error: 'Unauthorized' }
    }

    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string || 'USER'

    if (!username || !password) {
        return { error: 'Username and password are required' }
    }

    const existingUser = await db.user.findUnique({
        where: { username },
    })

    if (existingUser) {
        return { error: 'Username already exists' }
    }

    const hashedPassword = await hashPassword(password)

    await db.user.create({
        data: {
            username,
            password: hashedPassword,
            role,
        },
    })

    revalidatePath('/dashboard/users')
    return { success: true }
}

export async function getUsers() {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') {
        return []
    }

    return await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            username: true,
            role: true,
            createdAt: true,
            _count: {
                select: { todos: true }
            }
        }
    })
}
