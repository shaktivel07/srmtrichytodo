'use client'

import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import Image from 'next/image'
import { LayoutDashboard, Users, Info, LogOut, Menu, X, CheckSquare, Square } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface DashboardLayoutClientProps {
    session: {
        user: {
            id: string
            username: string
            role: string
        }
    }
    children: React.ReactNode
}

export default function DashboardLayoutClient({ session, children }: DashboardLayoutClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar - Collapsible */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex-col fixed h-full z-10 transition-all duration-300 overflow-hidden md:flex hidden`}>
                <div className="p-6 border-b border-gray-200 flex flex-col items-center text-center">
                    <div className="relative w-32 h-20 mb-4">
                        <Image
                            src="/logo.jpg"
                            alt="SRM Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h2 className="font-bold text-sm text-blue-900 leading-tight">SRM Group of Institutions</h2>
                    <p className="text-xs text-gray-500 mt-1">Tiruchirappalli</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/dashboard/pending" className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/dashboard/pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                        <Square size={20} />
                        <span>Pending</span>
                    </Link>

                    <Link href="/dashboard/completed" className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/dashboard/completed' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                        <CheckSquare size={20} />
                        <span>Completed</span>
                    </Link>

                    {session?.user.role === 'ADMIN' && (
                        <Link href="/dashboard/users" className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/dashboard/users' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                            <Users size={20} />
                            <span>Manage Users</span>
                        </Link>
                    )}

                    <Link href="/dashboard/about" className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${pathname === '/dashboard/about' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>
                        <Info size={20} />
                        <span>About</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="mb-4 px-2">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Developer</p>
                        <p className="text-sm font-medium text-gray-700">Shakthi</p>
                    </div>
                    <form action={logout}>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-medium">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'} p-4 md:p-8 transition-all duration-300`}>
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden md:flex items-center gap-2 mb-4 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    <span className="text-sm">{sidebarOpen ? 'Close' : 'Open'} Sidebar</span>
                </button>

                {/* Mobile Header */}
                <div className="md:hidden mb-4 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-8">
                            <Image src="/logo.jpg" alt="SRM Logo" fill className="object-contain" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xs text-blue-900">SRM Group</h2>
                            <p className="text-[10px] text-gray-500">Trichy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-md">
                            <LayoutDashboard size={20} />
                        </Link>
                        {session?.user.role === 'ADMIN' && (
                            <Link href="/dashboard/users" className="p-2 hover:bg-gray-100 rounded-md">
                                <Users size={20} />
                            </Link>
                        )}
                        <Link href="/dashboard/about" className="p-2 hover:bg-gray-100 rounded-md">
                            <Info size={20} />
                        </Link>
                        <form action={logout}>
                            <button className="p-2 hover:bg-red-50 text-red-600 rounded-md">
                                <LogOut size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {children}
            </main>
        </div>
    )
}
