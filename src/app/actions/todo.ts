'use server'

import { getSession } from '@/lib/auth'
import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createTodo(formData: FormData) {
    const session = await getSession()
    if (!session) {
        return
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDateStr = formData.get('dueDate') as string
    const priority = (formData.get('priority') as string) || 'MEDIUM'
    const targetUserId = formData.get('userId') as string

    if (!title) {
        return
    }

    // If admin provides a targetUserId, use it. Otherwise use session user id.
    const userId = (session.user.role === 'ADMIN' && targetUserId) ? targetUserId : session.user.id

    const todo = await db.todo.create({
        data: {
            title,
            description,
            priority,
            dueDate: dueDateStr ? new Date(dueDateStr) : null,
            userId,
        },
    })

    // Log the creation
    await db.todoLog.create({
        data: {
            todoId: todo.id,
            userId: session.user.id,
            action: 'CREATED',
            details: JSON.stringify({ title, priority, dueDate: dueDateStr }),
        },
    })

    revalidatePath('/dashboard')
}

export async function updateTodo(id: string, data: { title?: string; description?: string; completed?: boolean; dueDate?: Date | null; priority?: string }) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const todo = await db.todo.findUnique({ where: { id } })
    if (!todo) return { error: 'Todo not found' }

    if (session.user.role !== 'ADMIN' && todo.userId !== session.user.id) {
        return { error: 'Forbidden' }
    }

    // Track changes for logging
    const changes: any = {}
    if (data.title && data.title !== todo.title) changes.title = { from: todo.title, to: data.title }
    if (data.description !== undefined && data.description !== todo.description) changes.description = { from: todo.description, to: data.description }
    if (data.priority && data.priority !== todo.priority) changes.priority = { from: todo.priority, to: data.priority }
    if (data.dueDate !== undefined) {
        const oldDate = todo.dueDate?.toISOString()
        const newDate = data.dueDate?.toISOString()
        if (oldDate !== newDate) {
            changes.dueDate = { from: oldDate, to: newDate }
            // Calculate extension if due date moved forward
            if (todo.dueDate && data.dueDate && data.dueDate > todo.dueDate) {
                const days = Math.ceil((data.dueDate.getTime() - todo.dueDate.getTime()) / (1000 * 60 * 60 * 24))
                changes.extended = `${days} days`
            }
        }
    }

    await db.todo.update({
        where: { id },
        data,
    })

    // Log the update if there were changes
    if (Object.keys(changes).length > 0) {
        let action = 'UPDATED'
        if (changes.priority) action = 'PRIORITY_CHANGED'
        if (changes.extended) action = 'DUE_DATE_EXTENDED'

        await db.todoLog.create({
            data: {
                todoId: id,
                userId: session.user.id,
                action,
                details: JSON.stringify(changes),
            },
        })
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteTodo(id: string) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const todo = await db.todo.findUnique({ where: { id } })
    if (!todo) return { error: 'Todo not found' }

    if (session.user.role !== 'ADMIN' && todo.userId !== session.user.id) {
        return { error: 'Forbidden' }
    }

    await db.todo.delete({
        where: { id },
    })

    revalidatePath('/dashboard')
    return { success: true }
}

export async function toggleTodo(id: string) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const todo = await db.todo.findUnique({ where: { id } })
    if (!todo) return { error: 'Todo not found' }

    if (session.user.role !== 'ADMIN' && todo.userId !== session.user.id) {
        return { error: 'Forbidden' }
    }

    const newStatus = !todo.completed

    await db.todo.update({
        where: { id },
        data: { completed: newStatus },
    })

    // Log completion or reopening
    await db.todoLog.create({
        data: {
            todoId: id,
            userId: session.user.id,
            action: newStatus ? 'COMPLETED' : 'REOPENED',
            details: JSON.stringify({ completed: newStatus }),
        },
    })

    revalidatePath('/dashboard')
    return { success: true }
}

export async function getTodos() {
    const session = await getSession()
    if (!session) return []

    if (session.user.role === 'ADMIN') {
        return await db.todo.findMany({
            include: {
                user: { select: { username: true } }
            },
            orderBy: { createdAt: 'desc' },
        })
    } else {
        return await db.todo.findMany({
            where: { userId: session.user.id },
            include: {
                user: { select: { username: true } }
            },
            orderBy: { createdAt: 'desc' },
        })
    }
}

export async function getTodosForUser(userId: string) {
    const session = await getSession()
    if (!session || session.user.role !== 'ADMIN') return []

    return await db.todo.findMany({
        where: { userId },
        include: {
            user: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' },
    })
}

export async function getTodoLogs(todoId: string) {
    const session = await getSession()
    if (!session) return []

    return await db.todoLog.findMany({
        where: { todoId },
        orderBy: { createdAt: 'desc' },
    })
}

