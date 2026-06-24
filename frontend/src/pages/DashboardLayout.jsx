import { Outlet } from 'react-router-dom'
import shared from '../styles/Shared.module.css'
import styles from '../styles/DashboardLayout.module.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function DashboardLayout () {
  return (
    <div className={`${shared.flex} ${shared.column} ${shared.spaceBetween} ${shared.height100}`}>
      <div>
        <Navbar />
      </div>
      <div className={`${shared.body}`}>
        <Outlet />
      </div>
      <div>
        <Footer />
    </div>
    </div>
  )
}
