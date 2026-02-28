import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '🏠', label: 'Home', path: '/' },
]

const ESTADO_STATS = [
    { label: 'Pendientes', key: 'pendiente', color: 'text-slate-400' },
    { label: 'En Preview', key: 'preview', color: 'text-cyan-400' },
    { label: 'Aprobados', key: 'aprobado', color: 'text-blue-400' },
    { label: 'Listos', key: 'listo', color: 'text-green-400' },
]

export default function Sidebar({ videos = [] }) {
    const location = useLocation()
    const { user, logout } = useAuth()

    // Contar videos por estado
    const counts = videos.reduce((acc, v) => {
        acc[v.estado] = (acc[v.estado] || 0) + 1
        return acc
    }, {})

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shadow-sm">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-xl shadow-neon-blue">
                        🎬
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 text-sm leading-tight">VideoBot AI</h1>
                        <p className="text-[10px] text-slate-400">Generador de Videos</p>
                    </div>
                </div>
            </div>

            {/* Stats rápidas */}
            <div className="px-4 py-4 border-b border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3">Estado del Proyecto</p>
                <div className="space-y-2">
                    {ESTADO_STATS.map(({ label, key, color }) => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">{label}</span>
                            <span className={`text-xs font-bold font-mono ${color}`}>{counts[key] || 0}</span>
                        </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Total</span>
                        <span className="text-xs font-bold font-mono text-slate-700">{videos.length}</span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(({ icon, label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${location.pathname === path
                                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        <span>{icon}</span>
                        {label}
                    </Link>
                ))}
            </nav>

            {/* User info */}
            <div className="px-4 py-4 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || user?.username || 'Admin'}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@videobotai.com'}</p>
                    </div>
                </div>
                <button
                    id="btn-logout"
                    onClick={logout}
                    className="w-full btn-secondary text-xs py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    🚪 Cerrar sesión
                </button>
            </div>
        </aside>
    )
}
