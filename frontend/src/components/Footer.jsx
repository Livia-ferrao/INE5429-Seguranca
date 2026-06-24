import shared from '../styles/Shared.module.css'
import styles from '../styles/Footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';

export default function Footer () {
  return (
    <div className={`${styles.fter} ${shared.flex} ${shared.row} ${shared.alignCenter} ${shared.flexEnd}`}>
      <p>&copy; 2023 Estágios INE</p>
      <p className={`${shared.flex} ${shared.row} ${shared.alignCenter} ${styles.social_links}`}>
        <a href="https://www.linkedin.com/feed/"><FontAwesomeIcon icon={faLinkedinIn} style={{ color: "#fff" }} /></a>
        <a href="https://github.com/rlneto/sinestagios"><FontAwesomeIcon icon={faGithub} style={{ color: "#fff" }} /></a>
      </p>
    </div>
  )
}
