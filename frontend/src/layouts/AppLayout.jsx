import { Outlet } from 'react-router-dom'

import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}