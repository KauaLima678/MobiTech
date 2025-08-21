import style from './style.module.css'
import { IoSearch } from 'react-icons/io5'
import header from '../../images/Logo.png'
import { Link } from 'react-router-dom'


export default function Header({busca, setBusca}) {
  
  return (
    <div className={style.headerContainer}>
    <header>
        <img src={header} alt="" />
      <div className={style.inputCont}>
        <div className={style.input}>
          <IoSearch />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} type="text" placeholder='Digite oque você procura...'/>
        </div>
      </div>
          
      <nav>

        <Link to='/'>Home</Link>
        <Link to='/produtos'>Produtos</Link>
        <Link to='/categorias'>Categorias</Link>
      </nav>
    </header>
    </div>
  )
}