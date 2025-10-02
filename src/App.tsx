import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { useEffect } from 'react'
import { api } from './services/api'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import BottomNav from './components/BottomNav'

function AuthenticatedApp() {
  const { token, isLoading } = useAuth()

  useEffect(() => {
    if (token) {
      api.setAuthToken(token)
    }
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Authenticating...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/:jobId" element={<Dashboard />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  )
}

export default App
