'use server'

import { comparePassword, encrypt } from '@/lib/auth'
import db from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'Username and password are required' }
    }

    const user = await db.user.findUnique({
        where: { username },
    })

    if (!user) {
        return { error: 'Invalid credentials' }
    }

    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
        return { error: 'Invalid credentials' }
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: { id: user.id, username: user.username, role: user.role }, expires })

    const cookieStore = await cookies()
    cookieStore.set('session', session, { expires, httpOnly: true })

    redirect('/dashboard')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/login')
}
