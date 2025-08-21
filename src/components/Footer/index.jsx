import Logo from "../../images/Logo.png";
import style from './style.module.css'

export default function Footer() {
  return (
    <footer>
      <div className={style.col1}>
        <span>Sobre a Loja</span>
        <p>
          Seja bem-vindo à Distribuidora referência em peças e serviços para
          dispositivos móveis e eletrônicos. Enviamos para todo o Brasil com
          frete acessível e despacho rápido. Conte com mais de 30.000 produtos
          disponíveis em estoque para potencializar o desempenho da sua
          Assistência Técnica.
        </p>
      </div>
      <div className={style.col2}>
        <span>Institucional</span>
        <div className={style.Links}>
        <a href="">Fale Conosco</a><a href="">Política de Privacidade</a>
        </div>
      </div>
      <div className={style.col3}>
        <span>Central de Atendimento</span>
        <ul>
            <li>Telefone: (48) 99219-8585</li>
            <li>Whatsapp: (48) 99219-8585</li>
            <li>Email: vendas@gmail.com</li>
        </ul>
      </div>
    </footer>
  );
}
