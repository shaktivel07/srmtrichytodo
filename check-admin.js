const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.findUnique({
        where: { username: 'admin' },
    })

    if (admin) {
        console.log('Admin user found:', admin)
        // Reset password just in case
        const password = await bcrypt.hash('admin123', 10)
        await prisma.user.update({
            where: { username: 'admin' },
            data: { password },
        })
        console.log('Admin password reset to: admin123')
    } else {
        console.log('Admin user NOT found. Creating...')
        const password = await bcrypt.hash('admin123', 10)
        await prisma.user.create({
            data: {
                username: 'admin',
                password,
                role: 'ADMIN',
            },
        })
        console.log('Admin user created with password: admin123')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
