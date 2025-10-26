import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import InteractiveOrb from './components/InteractiveOrb'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import EnhancedResults from './pages/EnhancedResults'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-beige-50 to-beige-100 dark:from-black dark:to-black">
        <InteractiveOrb />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results" element={<EnhancedResults />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App