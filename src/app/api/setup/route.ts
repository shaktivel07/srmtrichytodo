import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET() {
    try {
        const existing = await db.user.findUnique({ where: { username: 'admin' } })
        if (existing) {
            return NextResponse.json({ message: 'Admin already exists' })
        }

        const password = await hashPassword('admin123')
        const admin = await db.user.create({
            data: {
                username: 'admin',
                password,
                role: 'ADMIN',
            },
        })
        return NextResponse.json({ message: 'Admin created', admin })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
