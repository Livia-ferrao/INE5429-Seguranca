import shared from '../styles/Shared.module.css'
import styles from '../styles/Card.module.css'

export default function Card (props) {
  return (
    <div className={`${props.estilo ? props.estilo : styles.card} ${styles.cardBody} ${shared.flex} ${shared.column}`}>
        {props.children}
    </div>
  )
}
