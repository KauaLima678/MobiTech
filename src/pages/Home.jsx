import Header from "../components/Header";
import style from "../styles/home.module.css"
import hero from "../images/Hero Image.png"
import { LuBell, LuBox, LuBrain } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Home() {
  const [busca, setBusca] = useState("")

  return (
    <>
    <Header busca={busca} setBusca={setBusca} />
    <div className={style.herosection}>
      <img src={hero} alt="" />
    </div>

    <div className={style.intro}>
      <h1>Gerencie seu Estoque com <span>Inteligência</span></h1>
      <p>Sistema completo de gerenciamento de estoque para sua loja de componentes eletrônicos. Controle produtos, monitore níveis de estoque e otimize suas vendas.</p>
      <Link to='/produtos' className={style.btnAcess}><LuBox /> Acessar Sistema</Link>
    </div>

    <div className={style.services}>
      <div className={style.servicesTitle}>
        <h1>Nossos Serviços</h1>
        <p>Descubra como nossa plataforma pode transformar a gestão do seu estoque com recursos avançados e interface intuitiva</p>
      </div>
      <div className={style.gridCards}>
        <div className={style.card}>
          <div className={`${style.icon} ${style.brain}`}><LuBrain /></div>
          <h1 className={style.titleCard}>Controle de Estoque Inteligente</h1>
          <span className={style.desc}>Sistema automatizado que monitora seus produtos em tempo real com algoritmos avançados de previsão.</span>
        </div>
        <div className={style.card}>
          <div className={`${style.icon} ${style.eye}`}><IoEyeOutline /></div>
          <h1 className={style.titleCard}>Visual Confortável e Interativo</h1>
          <span className={style.desc}>Interface moderna e intuitiva projetada para facilitar o uso diário e reduzir a fadiga visual.</span>
        </div>
       
      </div>
    </div>
    <Footer />
    </>
  );
}
