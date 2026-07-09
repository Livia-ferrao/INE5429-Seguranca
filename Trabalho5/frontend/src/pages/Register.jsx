import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import InputText from '../components/InputText'
import { Button, CircularProgress } from '@mui/material'
import Card from '../components/Card'
import axios from 'axios'
import shared from '../styles/Shared.module.css'
import styles from '../styles/Register.module.css'

export default function Register () {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navegar = useNavigate()
  const [loading, setLoading] = useState(false)
  const api = axios.create({ baseURL:'http://localhost:4000/api/v1/auth/cadastro'})
  const RegisterHandler = async () => {
    setLoading(true)
    if (passwordRef.current.value === confirmPasswordRef.current.value) {
      const user = {
        nome: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value
      }
      try {
        const response = await api.post('', user)
        console.log(response.status)
        if (response.status === 201) {
          alert('Usuário cadastrado com sucesso!')
          setLoading(false)
          navegar('/login')
        } else {
          alert('Erro ao cadastrar usuário')
          setLoading(false)
          navegar('/register')
        }
      } catch (error) {
        alert('Erro ao cadastrar usuário')
        setLoading(false)
        navegar('/register')
      }
    } else {
      alert('As senhas não conferem')
      navegar('/register')
    }
  }

  return (
    <div className={`${shared.flex} ${shared.column} ${shared.alignCenter} ${shared.marginTop}`}>
      <Card>
      <div className={`${styles.title}`}><h1>Cadastro</h1></div>
      <div>
        <form className={`${styles.box_form} ${shared.marginBottom}`}>
          <InputText tipo='text' nome='name' rotulo='Nome' referencia={nameRef} />
          <InputText tipo='email' nome='email' rotulo='E-mail' referencia={emailRef} />
          <InputText tipo='password' nome='password' rotulo='Senha' referencia={passwordRef} />
          <InputText tipo='password' nome='confirmPassword' rotulo='Confirme a senha' referencia={confirmPasswordRef} />
          </form>
          <Button fullWidth onClick={RegisterHandler} variant="contained" color="primary" className={`${styles.btn}`} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Cadastrar-se'}</Button>
        </div>
        <div className={`${shared.marginTop} ${shared.textAlignCenter}`}>
          <span>Já possui cadastro?</span>
          <Link className={`${shared.nav_link}`} to='/login'>Faça login</Link>
        </div>
        </Card>
      </div>
    
  )
}
