import shared from '../styles/Shared.module.css'
import styles from '../styles/Navbar.module.css'
import { useContext, useState } from 'react'
import LoggedInContext from '../LoggedInContext'
import UserContext from '../UserContext'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { Link } from 'react-router-dom';
import lamp from '../assets/lamp.png'
import {faBars} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Navbar () {
  const { loggado, setLoggado } = useContext(LoggedInContext)
  const { setUser } = useContext(UserContext)
  const [showDropdown, setShowDropDown ]= useState(false)

  const navegar = useNavigate();
  const linksLoggado = (
    <>
      <Link to="/dashboard/all" className={`${styles.nav_link}`}>Vagas</Link>
      <li>
        <Link to="/dashboard/inbox" className={`${styles.nav_link}`}>Inbox</Link>
      </li>
      <li>
        <Link to="/dashboard/profile" className={`${styles.nav_link}`}>Perfil</Link>
      </li>
      <li>
        <Link to="/dashboard/mensagem" className={`${styles.nav_link}`}>Escrever Mensagem</Link>
      </li>
      <li>
        <Link to="/dashboard/add" className={`${styles.nav_link}`}>Criar Vaga</Link>
      </li>
      <li>
        <Link to="/dashboard/sobre" className={`${styles.nav_link}`}>Sobre</Link>
      </li>
      <li>
      
        <Button action={() => {
          setLoggado(false)
          setUser(null)
          navegar('/login')
          }} estilo={`${styles.navbar_btn}`} text={`Sair`}/>
      </li>

    </>
  )

  const dropDownMenu = (
    <div className={`${styles.dropdown_menu}`}>
        <li>
          <Link to="/dashboard/all" className={`${styles.nav_link_dropdown}`}>Vagas</Link>
        </li>
        <li>
          <Link to="/dashboard/inbox" className={`${styles.nav_link_dropdown}`}>Inbox</Link>
        </li>
        <li>
          <Link to="/dashboard/profile" className={`${styles.nav_link_dropdown}`}>Perfil</Link>
        </li>
        <li>
          <Link to="/dashboard/mensagem" className={`${styles.nav_link_dropdown}`}>Escrever Mensagem</Link>
        </li>
        <li>
          <Link to="/dashboard/add" className={`${styles.nav_link_dropdown}`}>Criar vaga</Link>
        </li>
        <li>
          <Link to="/dashboard/sobre" className={`${styles.nav_link_dropdown}`}>Sobre</Link>
        </li>
        <li>
        
          <Button action={() => {
            setLoggado(false)
            setUser(null)
            navegar('/login')
            }} estilo={`${styles.navbar_btn_dropdown}`} text={`Sair`}/>
        </li>
    </div>
  )

  const dropDownMenuNaoLogado = (
    <div className={`${styles.dropdown_menu}`}>
      <li>
        <Link to="/register" className={`${styles.nav_link_dropdown}`}>Cadastro</Link>
      </li>
      <li >
        <Button action={() => {navegar('/login')}} text={`Login`} estilo={styles.navbar_btn_dropdown}/>
      </li>
    </div>
  )
  
  function onClickBar() {
    if (showDropdown) {
      setShowDropDown(false)
      return
    }
    setShowDropDown(true)
  }

  const linksNaoLoggado = (
    <>
      <li>
        <Link to="/register" className={`${styles.nav_link}`}>Cadastro</Link>
      </li>
      <li >
        <Button action={() => {navegar('/login')}} text={`Login`} estilo={shared.btn}/>
      </li>
    </>
  )
  return (
    <div className={`${shared.flex} ${shared.alignCenter} ${styles.container}`}>
      <div className={`${shared.flex} ${shared.textAlignStart} ${styles.c1}`}>
        <div><img className={`${styles.logo}`} src={lamp}></img></div>
        <h1 className={`${styles.h1}`}> Estágios<span className={`${styles.title_INE}`}> INE</span></h1>
      </div>
      <div className={`${styles.c2}`}>
        <nav>
          <ul className={`${styles.ul} ${shared.flex} ${shared.row} ${shared.alignCenter}`}>
            {/* <li><button onClick={() => {setLoggado(!loggado)}}>{loggado ? `Desloggar` : `Loggar`}</button></li> */}
            {/* <li><button onClick={() => {console.log(window.location.href)}}>Console</button></li> */}
            {loggado ? linksLoggado : linksNaoLoggado}
          </ul>
        </nav>
      </div>
      <div className={`${styles.toggle_btn}`}>
        <FontAwesomeIcon icon={faBars} onClick={onClickBar}></FontAwesomeIcon>
      </div>
    {showDropdown && loggado ? dropDownMenu : null}
    {showDropdown && !loggado ? dropDownMenuNaoLogado : null}


    </div>
  )
}
