import axios from "axios";
import style from "../styles/produtos.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { CgAddR } from "react-icons/cg";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState([]); // Ajustado para array vazio
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(""); // <-- 1. NOVO ESTADO
  const [erro, setErro] = useState("");

  useEffect(() => {
    const api = axios.create({
      baseURL: "http://localhost:3333",
    });

    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log("Erro ao buscar os produtos", err));

    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const handleAumentarQuantidade = (produtoId) => {
    const novaListaProdutos = produtos.map((produto) => {
      if (produto.id === produtoId) {
        return { ...produto, quantity: produto.quantity + 1 };
      }
      return produto;
    });
    setProdutos(novaListaProdutos);
  };

  const handleDiminuirQuantidade = (produtoId) => {
    const novaListaProdutos = produtos.map((produto) => {
      if (produto.id === produtoId && produto.quantity > 1) {
        return { ...produto, quantity: produto.quantity - 1 };
      }
      return produto;
    });
    setProdutos(novaListaProdutos);
  };

  // <-- 3. LÓGICA DE FILTRAGEM ATUALIZADA
  const produtosFiltrados = produtos
    .filter((produto) => {
      // Filtro por busca (nome)
      return produto.name.toLowerCase().includes(busca.toLowerCase());
    })
    .filter((produto) => {
      // Filtro por categoria
      if (!categoriaSelecionada) {
        return true; // Se nenhuma categoria estiver selecionada, mostra todos
      }
      // ATENÇÃO: Verifique se o nome da propriedade é 'category_id' no seu objeto de produto
      return produto.categoryId == categoriaSelecionada;
    });

  return (
    <>
      <Header busca={busca} setBusca={setBusca} />
      <div className={style.container}>
        <div className={style.sectionTitle}>
          <h1>Produtos</h1>
        </div>
        <div className={style.filterArea}>
          <div className={style.filterColumn}>
            <span>
              Filtrar <FaFilter />
            </span>
            {/* <-- 2. SELECT CONECTADO AO ESTADO --> */}
            <select
              name="categoria"
              id="categorias"
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="">Filtre Por categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={style.produtos}>
          <Link to="/cadastrar-produto" className={style.cardAdd}>
            <CgAddR />
          </Link>
          {produtosFiltrados.length === 0 ? (
            <p className={style.null}>Nenhum produto encontrado</p> 
          ) : (
            produtosFiltrados.map((produto) => {
              return (
                <div key={produto.id} className={style.table}>
                  <div className={style.headerCard}>
                    <div className={style.price}>
                      <span className={style.preco}>
                        {produto.price.toFixed(2)}
                      </span>
                    </div>
                    <div className={style.edit}>
                      <Link to={`/editar-produto/${produto.id}`}>
                        <FaRegEdit />
                      </Link>
                    </div>
                  </div>

                  <div className={style.image}>
                    <img
                      src={`http://localhost:3333${produto.imageUrl}`}
                      alt={produto.name}
                      width={100}
                    />
                  </div>

                  <p>{produto.description}</p>

                  <div className={style.math}>
                    <button
                      onClick={() => handleAumentarQuantidade(produto.id)}
                    >
                      <IoIosAddCircleOutline />
                    </button>
                    <span>{produto.quantity}</span>
                    <button
                      onClick={() => handleDiminuirQuantidade(produto.id)}
                    >
                      <GrSubtractCircle />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}