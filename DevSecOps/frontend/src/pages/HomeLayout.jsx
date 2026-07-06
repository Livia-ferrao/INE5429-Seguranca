import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import shared from '../styles/Shared.module.css'

export default function HomeLayout () {

  return (
    <div className={`${shared.flex} ${shared.column} ${shared.spaceBetween} ${shared.height100}`}>
      
      <div className={`${shared.row}`}><Navbar/></div>
      {/* <div>
        <div><img className={`${styles.logo}`} src='lamp.png'></img></div>
        <div>
        <h1>Estágios INE</h1>
        </div>
        </div> */}
      <div className={`${shared.body}`}><Outlet /></div>
      <div><Footer /></div>
    </div>
  )
  
}
