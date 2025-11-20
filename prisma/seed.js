const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    // Hash the password
    const hashedPassword = await bcrypt.hash('srm@trichy', 10)

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { username: 'srm' }
    })

    if (existingAdmin) {
        console.log('Admin user already exists')
        return
    }

    // Create admin user
    await prisma.user.create({
        data: {
            username: 'srm',
            password: hashedPassword,
            role: 'ADMIN'
        }
    })

    console.log('Admin user created successfully')
    console.log('Username: srm')
    console.log('Password: srm@trichy')
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
