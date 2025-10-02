import Keycloak from 'keycloak-js'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const keycloak = new Keycloak({
  url: 'https://shield.shearfrac.com',
  realm: 'sfg',
  clientId: 'production-shearstreamweb-9836353444ef91f9ac6f5f3b842b860a',
})

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated)
        setToken(keycloak.token || null)
        setIsLoading(false)

        // Refresh token every 30 seconds
        setInterval(() => {
          keycloak
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setToken(keycloak.token || null)
              }
            })
            .catch(() => {
              console.error('Failed to refresh token')
            })
        }, 30000)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const login = () => {
    keycloak.login()
  }

  const logout = () => {
    keycloak.logout()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
