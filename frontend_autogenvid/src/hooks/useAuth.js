import { useState, useEffect } from 'react'
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Usuario mock para desarrollo
const MOCK_USER = {
    username: 'oswaldo.dev',
    userId: 'mock-user-001',
    email: 'oswaldo@videobotai.com',
    name: 'Oswaldo Admin',
}

/**
 * Hook personalizado para manejar el estado de autenticación Cognito.
 * En modo mock, simula un usuario autenticado sin llamadas reales.
 */
export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function checkUser() {
        if (USE_MOCK) {
            // Simular delay de verificación
            await new Promise(r => setTimeout(r, 500))
            setUser(MOCK_USER)
            setLoading(false)
            return
        }

        try {
            const currentUser = await getCurrentUser()
            const session = await fetchAuthSession()
            setUser({
                ...currentUser,
                email: session.tokens?.idToken?.payload?.email,
                name: session.tokens?.idToken?.payload?.name || currentUser.username,
            })
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkUser()

        if (!USE_MOCK) {
            // Escuchar eventos de autenticación de Amplify
            const unsubscribe = Hub.listen('auth', ({ payload }) => {
                switch (payload.event) {
                    case 'signedIn': checkUser(); break
                    case 'signedOut': setUser(null); break
                    default: break
                }
            })
            return unsubscribe
        }
    }, [])

    async function logout() {
        if (USE_MOCK) {
            setUser(null)
            return
        }
        try {
            await signOut({ global: true })
            setUser(null)
        } catch (err) {
            setError(err.message)
        }
    }

    return { user, loading, error, logout, isAuthenticated: !!user }
}
