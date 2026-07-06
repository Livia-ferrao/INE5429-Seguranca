import { useNavigate } from 'react-router-dom'
import { useRef, useContext, useState } from 'react'
// import { users } from '../db/Database'
import { Button, CircularProgress } from '@mui/material'
import InputText from '../components/InputText'
import Card from '../components/Card'
import shared from '../styles/Shared.module.css'
import styles from '../styles/Register.module.css'
import UserContext from '../UserContext'
import axios from 'axios'

export default function UpdateUser () {
  const nameRef = useRef();
  const birthDateRef = useRef();
  const genderRef = useRef();
  // const fotoRef = useRef();
  const navegar = useNavigate()
  const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
  const api = axios.create({
    baseURL: 'http://localhost:4000/api/v1/auth/update'
  })

  const UpdateHandler = async () => {
    setLoading(true)
    //descomentar linhas 26 a 32 quando for rodar com o backend
    try {
      const response = await api.post('', {
        email: user.email,
        nome: nameRef.current.value,
        genero: genderRef.current.value,
        dataNasc: birthDateRef.current.value,
        // foto: fotoRef.current.value,
    })
    user.nome = nameRef.current.value
    user.genero = genderRef.current.value
    user.dataNasc = birthDateRef.current.value
    console.log(response)
    alert('Usuário atualizado com sucesso!')
    setLoading(false)
    navegar('/dashboard/profile')

    } catch (error) {
      console.log(error)
      alert('Erro ao atualizar perfil')
      setLoading(false)
      navegar('/dashboard/profile')
    }

  }

  return (
    <div className={`${shared.flex} ${shared.column} ${shared.alignCenter} ${shared.marginTop}`}>
      <Card>
      <div className={`${styles.title}`}><h1>Dados do Usuário</h1></div>
      <div>
        <form className={`${styles.box_form} ${shared.marginBottom}`}>
          <InputText tipo='text' nome='name' rotulo='Nome' referencia={nameRef} />
          <InputText tipo='date' nome='birthDate' rotulo='Data de Nascimento' referencia={birthDateRef} />
          <InputText tipo='text' nome='gender' rotulo='Gênero' referencia={genderRef} />
          {/* <InputText tipo='text' nome='foto' rotulo='Link da Imagem' valorPadrao='Link da Imagem' referencia={fotoRef}/> */}
          </form>

          {/* <div className={`${styles.btn}`}><Button text={`Atualizar`} action={UpdateHandler} estilo={shared.btnLogin}>Atualizar</Button></div> */}
        </div>
          <Button fullWidth onClick={UpdateHandler} variant="contained" color="primary" className={`${styles.btn}`} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Atualizar'}</Button>
        </Card>
      </div>
    
  )
}
