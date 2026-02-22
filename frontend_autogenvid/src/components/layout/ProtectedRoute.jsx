import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Envuelve rutas que requieren autenticación.
 * Redirige a /login si el usuario no tiene sesión activa.
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return null
    if (!isAuthenticated) return <Navigate to="/login" replace />

    return children
}
