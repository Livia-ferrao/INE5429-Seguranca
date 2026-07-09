import { Link, useNavigate  } from 'react-router-dom'
// import { Card } from '@mui/material'
import Card from '../components/Card'
import styles from '../styles/Profile.module.css'
import { useContext, useState, useEffect } from 'react'
import UserContext from '../UserContext'
import shared from '../styles/Shared.module.css'
import Button from '../components/Button'

export default function Profile () {
  const { user } = useContext(UserContext)
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
  }, [user]);
  const navegar = useNavigate()
  console.log(user, userData)
  return (
    <div>
      <Card>
        <div className={`${shared.flex} ${shared.column} ${shared.alignCenter} ${shared.bigGap}`}>
          <div className={`${shared.flex} ${shared.column} ${shared.alignCenter} ${shared.bigGap}`}>
            <img className={`${styles.imgCard}`} src={user.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="" />
            <h1 className={`${styles.titleNome}`}>Perfil de {user.nome}</h1>
            <p className={`${styles.titleEmail}`}>Email: {user.email}</p>
            <p className={`${styles.titleEmail}`}>Gênero: {user.genero}</p>
            <p className={`${styles.titleEmail}`}>Data de Nascimento: {user.dataNasc}</p>

          </div>
          <div className={`${shared.flex} ${shared.alignCenter} ${shared.bigGap}`}>
          <Link to="/dashboard/atualizar-usuario">
            <Button text={`Editar Perfil`} estilo={shared.btnVagas}></Button>
          </Link>
            <Button action={() => navegar('/dashboard/inbox')} text={`Ver mensagens`} estilo={shared.btnVagas}></Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

