import Header from './components/Header'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Music from './pages/Music'
import Jobs from './pages/Jobs'
import NotFound from './pages/NotFound'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <NavBar />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/music" element={<Music />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
