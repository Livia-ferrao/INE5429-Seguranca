import { useRouteError, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import Button from '../components/Button'
import LoggedInContext from '../LoggedInContext'
import UserContext from '../UserContext'

export default function Error () {
  const navegar = useNavigate();
  const error = useRouteError();
  const { setLoggado } = useContext(LoggedInContext)
  const { setUser } = useContext(UserContext)
  const goBack = () => {
    setLoggado(false)
    setUser(null)
    navegar('/')
  }





  return (<div>
    <h1>Erro {`${error}`}</h1>
    <Button action={goBack} text={`Voltar para a página inicial`} />
    </div>
  )
}
