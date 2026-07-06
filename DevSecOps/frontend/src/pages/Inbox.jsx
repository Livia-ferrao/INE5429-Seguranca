import Card from '../components/Card'
import { useContext } from 'react'
import UserContext from '../UserContext'
import shared from '../styles/Shared.module.css'
import styles from '../styles/Inbox.module.css'

export default function Inbox () {
  const { user } = useContext(UserContext)

  return (
    <div className={`${shared.flex} ${shared.column} ${shared.marginTop}`}>
      <div className={`${shared.row} ${shared.marginBottom} ${shared.textAlignCenter} ${shared.textSize12}`}>
        <h1>Caixa de Entrada de <span className={`${shared.colorBlue}`}>{user.nome}</span></h1>
      </div>
      <div className={`${shared.row} ${shared.marginBottom} ${shared.textAlignCenter}`}>
        <p>Email: {user.email}</p></div>
      <div className={`${shared.row} ${shared.marginBottom} ${shared.textAlignCenter}`}>
        <h3>Mensagens na Caixa de Entrada</h3>
      </div>
    
      <ul>
        {user.inbox.map((message, index) => (
          <li className={`${shared.marginBottom}`} key={index}>
          <Card>
            <div className={`${shared.flex} ${shared.column} ${shared.bigGap}`}>
              <div><strong>De:</strong> {message.remetente}</div>
              <div><strong>Título:</strong> {message.titulo}</div>
              <div><strong>Mensagem:</strong> {message.mensagem}</div>
            </div>
          </Card>
          </li>
        ))}
        <p></p>
      </ul>
      <div className={`${shared.row} ${shared.marginBottom}`}>
      <h3 className={`${shared.marginBottom} ${shared.textAlignCenter}`}>Mensagens Enviadas</h3>
      <ul>
        {user.outbox.map((message, index) => (
          <li className={`${shared.marginBottom}`} key={index}>
            <Card>
              <strong>Para:</strong> {message.destinatario}<br />
              <strong>Título:</strong> {message.titulo}<br />
              <strong>Mensagem:</strong> {message.mensagem}
            </Card>
          </li>
        ))}
        <p></p>
      </ul>
      </div>
    </div>
  )
}
