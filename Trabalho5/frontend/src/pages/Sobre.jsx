import ufsc from "../assets/ufsc.png";
import shared from "../styles/Shared.module.css";
import styles from "../styles/Sobre.module.css";

export default function Sobre() {
  return (
    <div
      className={`${shared.flex} ${shared.column} ${shared.alignCenter} ${styles.cardd}`}
    >
      <div
        className={`${shared.row} ${shared.marginBottom} ${shared.marginBottom} ${shared.textAlignCenter}`}
      >
        <h1 className={`${styles.title}`}>Sobre</h1>
      </div>
      <div
        className={`${shared.row} ${shared.wrap} ${shared.max80vw} ${shared.alignCenter} ${shared.bigGap}`}
      >
        <div
          className={`${shared.flex} ${shared.column}  ${shared.bigGap} ${shared.justifyCenter} ${styles.card_text}`}
        >
          <p className={`${styles.paragrafo}`}>
            Seja bem-vindo(a) ao nosso Sistema de Vagas de Estágio!<br></br>
          </p>
          <p className={`${styles.paragrafo}`}>
            Nós entendemos a importância vital do estágio na jornada acadêmica.
            Por isso, estamos comprometidos em oferecer oportunidades
            excepcionais para você desenvolver suas habilidades e experiência
            prática.Nosso sistema é projetado para simplificar e facilitar o
            processo de busca por estágios, conectando você a uma ampla gama de
            oportunidades em diferentes áreas e empresas parceiras. Ao usar
            nosso sistema, você terá acesso a:
          </p>
          <p className={`${styles.paragrafo}`}>
            - Uma variedade de vagas de estágio em empresas renomadas.<br></br>-
            Recursos para aprimorar suas habilidades profissionais.<br></br>-
            Suporte personalizado durante todo o processo de candidatura.
            <br></br>- Queremos ajudá-lo a alcançar seus objetivos profissionais
            e impulsionar sua carreira desde o início.<br></br>
            Junte-se a nós nesta jornada de aprendizado e crescimento
            profissional.<br></br>
          </p>
        </div>
        <div className={`${styles.img_card}`}>
          <img className={`${styles.img}`} src={ufsc} alt="Imagem UFSC" />
        </div>
      </div>
    </div>
  );
}
