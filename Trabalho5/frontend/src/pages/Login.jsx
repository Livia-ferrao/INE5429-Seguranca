import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import LoggedInContext from '../LoggedInContext'
import UserContext from '../UserContext'
import InputText from '../components/InputText'
import Card from '../components/Card'
import { Button, CircularProgress } from '@mui/material'
import shared from '../styles/Shared.module.css'
import styles from '../styles/Login.module.css'
import axios from 'axios'

export default function Login () {
  const { setLoggado } = useContext(LoggedInContext)
  const { setUser } = useContext(UserContext)
  const navegar = useNavigate();
  const [loading, setLoading] = useState(false)
  const api = axios.create({
    baseURL: 'http://localhost:4000/api/v1/auth/login'
  })
  const LoginHandler = async () => {
    setLoading(true)
    const email = emailRef.current.value
    const password = passwordRef.current.value
    try {
      const response = await api.post('', {
        email: email,
        password: password
      })
      console.log(response.status)
      console.log(response)
      const user = { ...response.data.usuario, token: response.data.token }
      setUser(user)
      setLoggado(true)
      setLoading(false)
      navegar('/dashboard/all')
    } catch (error) {
      alert('Usuário não encontrado')
      setLoading(false)
      navegar('/login')
    }
  }
  const emailRef = useRef();
  const passwordRef = useRef();
  return (
    <div className={`${shared.flex} ${shared.column} ${shared.alignCenter }`}>
      <div className={`${shared.row} ${shared.marginBottom}`}>
      <Card>
        <div className={`${styles.title}`}><h1>Login</h1></div>
        <div className={`${shared.flex} ${shared.column} ${shared.marginBottom}`}>
          <form className={`${styles.box_form}`}>
            <InputText tipo='email' nome='email' rotulo='E-mail' valorPadrao={'paulgarrido@earth.com.br'} referencia={emailRef} />
          <InputText tipo='password' nome='password' rotulo='Senha' referencia={passwordRef} valorPadrao={'quantacoisaboa'}/>
          </form>
        </div>
        <Button fullWidth onClick={LoginHandler} variant="contained" color="primary" className={`${styles.btn}`} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Entrar'}</Button>
        <div className={`${shared.flex} ${shared.row} ${shared.justifyCenter} ${styles.box_cadastro}`}>
          <p>Não tem uma conta?</p>
          <Link to='/register' className={`${styles.nav_link}`}>Cadastrar-se</Link>
        </div>
      </Card>
      </div>
    </div>
  )
}
