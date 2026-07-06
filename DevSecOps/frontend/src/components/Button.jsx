import shared from '../styles/Shared.module.css'
import styles from '../styles/Button.module.css'

export default function Button (props) {
  return (
    <div>
      <button className={props.estilo ? props.estilo : styles.btn} onClick={props.action}>{props.text}</button>  
    </div>
  )
}
