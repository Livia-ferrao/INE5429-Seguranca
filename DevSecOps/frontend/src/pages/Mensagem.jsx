import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../UserContext'
import Card from '../components/Card'
import InputText from '../components/InputText'
import { Button, CircularProgress } from '@mui/material'
import shared from '../styles/Shared.module.css'
import styles from '../styles/Mensagem.module.css'
import axios from 'axios'

export default function Mensagem () {
  const { user } = useContext(UserContext)
  const destinatarioRef = useRef()
  const tituloRef = useRef()
  const mensagemRef = useRef()
  const navegar = useNavigate()
  const [loading, setLoading] = useState(false)
  const api = axios.create({
    baseURL: 'http://localhost:4000/api/v1/mensagens'
  })
  const enviarMensagem = async () => {
    setLoading(true)
    const destinatario = destinatarioRef.current.value
    const titulo = tituloRef.current.value
    const mensagem = mensagemRef.current.value
    const data = new Date()
    const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
    const mensagemObj = {
      remetente: user.email,
      destinatario: destinatario,
      titulo: titulo,
      mensagem: mensagem,
      data: dataFormatada
    }
    console.log(mensagemObj)
    try {
      const response = await api.post('', mensagemObj)
      console.log(response.status)
      if (response.status === 201) {
        alert('Mensagem enviada com sucesso!')
        user.outbox.push(mensagemObj)
        setLoading(false)
        navegar('/dashboard/inbox')
      } else {
        alert('Erro ao enviar mensagem')
        setLoading(false)
        navegar('/dashboard/inbox')
      }
    } catch (error) {
      alert('Erro ao enviar mensagem')
      setLoading(false)
      navegar('/dashboard/inbox')
    }
  }

// export default function Mensagem () {
//   const { user } = useContext(UserContext)
//   const destinatarioRef = useRef()
//   const tituloRef = useRef()
//   const mensagemRef = useRef()
//   const enviarMensagem = () => {
//     const destinatario = destinatarioRef.current.value
//     const titulo = tituloRef.current.value
//     const mensagem = mensagemRef.current.value
//     const data = new Date()
//     const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
//     const mensagemObj = {
//       remetente: user.email,
//       destinatario: destinatario,
//       titulo: titulo,
//       mensagem: mensagem,
//       data: dataFormatada
//     }
//     console.log(mensagemObj)
//     alert('Verificar no console (Ctrl + Shift + i) o objeto da mensagem')
//     try {
//       users.find(user => user.email === destinatario).inbox.push(mensagemObj)
//       user.outbox.push(mensagemObj)
//     } catch {
//       alert('Erro: Usuário não encontrado')
//     }
    
//   }

  return (
    <div className={`${shared.marginTop}`}>
      <Card>
        <h1>Enviar Mensagem</h1>
        <div>
          <InputText tipo={'email'} nome={'destinatario'} rotulo={'Destinatário'} valorPadrao={'email@email.com'} referencia={destinatarioRef}/>
        </div>
        <div>
          <InputText tipo={'text'} nome={'titulo'} rotulo={'Título'} valorPadrao={'Título da mensagem'} referencia={tituloRef}/>
        </div>
        <div className={`${shared.marginTop}`}>
          <label className={`${shared.rotulo}`} htmlFor={'mensagem'}>Mensagem</label>
        </div>
        <div>
          <textarea className={`${styles.textarea}`} name={'mensagem'} id={'mensagem'} cols={'30'} rows={'10'} placeholder={'Digite sua mensagem aqui'} ref={mensagemRef}/>
        </div>
        <Button fullWidth onClick={enviarMensagem} variant="contained" color="primary" className={`${styles.btn} ${shared.marginTop}`} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Enviar'}</Button>

        {/* <div>
          <Button action={enviarMensagem} text={'Enviar'} estilo={shared.btn}/>
        </div> */}
      </Card>
    </div>
  )
}
