import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Code2, GraduationCap, MapPin, Database, Server, Layout, ShieldCheck, BrainCircuit } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <h1 className="text-3xl font-bold text-gray-900">About the Application</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Developer Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <Image
                                    src="/developer.jpg"
                                    alt="Shakthivel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Shakthivel</h2>
                                <p className="text-blue-600 font-medium flex items-center justify-center gap-2">
                                    <BrainCircuit size={16} />
                                    Data Scientist
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-gray-600">
                                <GraduationCap size={18} className="text-blue-500" />
                                <span>B.Tech CSE</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin size={18} className="text-red-500" />
                                <span>SRMIST, Trichy</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link
                                href="https://in.linkedin.com/in/shaktivel-t-k-803a75335"
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full text-white bg-[#0077b5] hover:bg-[#006399] px-4 py-2.5 rounded-md font-medium transition-colors shadow-sm"
                            >
                                <ExternalLink size={18} />
                                Connect on LinkedIn
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Application</p>
                                    <p className="font-medium text-lg text-gray-900">SRM Todo Management System</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Version</p>
                                        <p className="font-mono text-sm mt-1">v1.2.0-stable</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Build</p>
                                        <p className="font-mono text-sm mt-1">2025.11.20</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 mt-1">
                                            PRODUCTION
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tech Stack</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                                    <Layout size={16} className="text-gray-500" />
                                    <span className="text-sm font-medium">Next.js 15</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                                    <Database size={16} className="text-blue-500" />
                                    <span className="text-sm font-medium">Prisma ORM</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                                    <Server size={16} className="text-green-500" />
                                    <span className="text-sm font-medium">SQLite</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50">
                                    <ShieldCheck size={16} className="text-purple-500" />
                                    <span className="text-sm font-medium">JWT Auth</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
