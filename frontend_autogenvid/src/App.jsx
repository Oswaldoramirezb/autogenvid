import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import LoadingSkeleton from './components/ui/LoadingSkeleton'

export default function App() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm animate-pulse">Verificando sesión...</p>
                </div>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
