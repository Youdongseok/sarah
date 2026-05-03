import { Navigate, Route, Routes } from 'react-router-dom'
import LiquidHeartPage from './pages/LiquidHeartPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LiquidHeartPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
