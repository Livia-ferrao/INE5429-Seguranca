import { useContext, useRef, useState } from 'react'
import UserContext from '../UserContext'
import Card from '../components/Card'
import InputText from '../components/InputText'
import Button from '../components/Button'
import shared from '../styles/Shared.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

export default function AddEstagio () {
  const { user } = useContext(UserContext)
  const navegar = useNavigate()
  const [loading, setLoading] = useState(false)
  const empresaRef = useRef()
  const tituloRef = useRef()
  const localRef = useRef()
  const descricaoRef = useRef()
  const periodoRef = useRef()
  const imagemRef = useRef()

  const cadastrarVaga = async () => {
    setLoading(true)
    const novaVaga = {
      id: Date.now(),
      empresa: empresaRef.current.value,
      titulo: tituloRef.current.value,
      local: localRef.current.value,
      descricao: descricaoRef.current.value,
      periodo: periodoRef.current.value,
      autor: user?.email || '',
      imagem: imagemRef.current.value,
    }
    try {
      await axios.post('http://localhost:4000/api/v1/estagios', novaVaga, {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
      alert('Vaga cadastrada com sucesso!')
      navegar('/dashboard/all')
    } catch (error) {
      console.error(error)
      alert('Erro ao cadastrar vaga')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${shared.flex} ${shared.column} ${shared.marginTop}`}>
      <Card>
        <h1>Cadastrar vaga</h1>
        <div>
          <InputText tipo={'text'} nome={'titulo'} rotulo={'Título'} valorPadrao={'Título da vaga'} referencia={tituloRef}/>
        </div>
        <div>
          <InputText tipo={'text'} nome={'empresa'} rotulo={'Empresa'} valorPadrao={'Empresa'} referencia={empresaRef}/>
        </div>
        <div>
          <InputText tipo={'text'} nome={'local'} rotulo={'Local'} valorPadrao={'Local'} referencia={localRef}/>
        </div>
        <div>
          <InputText tipo={'text'} nome={'descricao'} rotulo={'Descrição'} valorPadrao={'Descrição'} referencia={descricaoRef}/>
        </div>
        <div>
          <InputText tipo={'text'} nome={'periodo'} rotulo={'Período'} valorPadrao={'Período'} referencia={periodoRef}/>
        </div>
        <div>
          <InputText tipo={'text'} nome={'imagem'} rotulo={'Link da Imagem (opcional)'} valorPadrao={''} referencia={imagemRef}/>
        </div>
        <div className={`${shared.marginTop}`}>
          {loading
            ? <CircularProgress size={24} />
            : <Button action={cadastrarVaga} text={'Cadastrar'} estilo={shared.btn}/>
          }
        </div>
      </Card>
    </div>
  )
}
