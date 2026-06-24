import shared from '../styles/Shared.module.css'
import styles from '../styles/InputText.module.css'
// Os nomes das classes são placeholders, na verdade são várias classes de CSS
export default function InputText ({tipo, nome, rotulo, valorPadrao, referencia}) {
  return (
    <div className={`${shared.inputtext}`}>
      <div className={`${styles.box}`}>
      <label className={`${shared.rotulo}`} htmlFor={nome}>{rotulo}</label></div>
      <div><input className={`${styles.box_input} ${shared.fontPadding}`} type={tipo} name={nome} id={nome} placeholder={valorPadrao} ref={referencia} required/></div>
    </div>
  )
}
