import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import BottomNav from './components/BottomNav'

function App() {
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

export default App
