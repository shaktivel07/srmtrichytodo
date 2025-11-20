const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

console.log('PrismaClient:', !!PrismaClient)
console.log('bcrypt:', !!bcrypt)

const prisma = new PrismaClient()

async function main() {
    console.log('Prisma User model:', !!prisma.user)

    if (!prisma.user) {
        console.error('prisma.user is undefined!')
        return
    }

    const password = await bcrypt.hash('admin123', 10)
    console.log('Password hashed')

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password,
            role: 'ADMIN',
        },
    })

    console.log('Admin user created:', admin)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Error in main:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
