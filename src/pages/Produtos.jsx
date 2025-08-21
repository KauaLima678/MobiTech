import axios from "axios";
import style from "../styles/produtos.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { CgAddR } from "react-icons/cg";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";


export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

 

  useEffect(() => {
     const api = axios.create({
    baseURL: "http://localhost:3333",
  });

    api
      .get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log("Erro ao buscar os produtos", err));
  }, []);

  const handleAumentarQuantidade = (produtoId) => {
    // Criamos uma nova lista de produtos usando .map
    const novaListaProdutos = produtos.map((produto) => {
      // Se o ID do produto no loop for igual ao ID que recebemos...
      if (produto.id === produtoId) {
        // ...retornamos um NOVO objeto com a quantidade incrementada.
        return { ...produto, quantity: produto.quantity + 1 };
      }
      // Senão, apenas retornamos o produto como ele está.
      return produto;
    });
    // Atualizamos o estado com a nova lista
    setProdutos(novaListaProdutos);
  };

  // Função para diminuir a quantidade de um produto específico
  const handleDiminuirQuantidade = (produtoId) => {
    const novaListaProdutos = produtos.map((produto) => {
      // Verificamos o ID e também se a quantidade é maior que 1 (para não ficar 0 ou negativo)
      if (produto.id === produtoId && produto.quantity > 1) {
        return { ...produto, quantity: produto.quantity - 1 };
      }
      return produto;
    });
    setProdutos(novaListaProdutos);
  };

  const produtosFiltrados = busca.trim()
    ? produtos.filter((produto) =>
        produto.name.toLowerCase().includes(busca.toLowerCase())
      )
    : produtos;
  return (
    <>
      <Header busca={busca} setBusca={setBusca} />
      <div className={style.container}>
        <div className={style.sectionTitle}>
          <h1>Produtos</h1>
        </div>
        <div className={style.produtos}>
          <Link to='/cadastrar-produto' className={style.cardAdd}>
                      <CgAddR />
                  </Link>
        {produtosFiltrados.length === 0 ? (
             <p className={style.null}>Nenhum produto cadastrado</p>
            ) : (
              produtosFiltrados.map((produto) => {

                return (
                  <div key={produto.id} className={style.table}>
                    <div className={style.headerCard}>
                      <div className={style.price}>
                          <span className={style.preco}>{produto.price.toFixed(2)}</span>
                        </div>
                        <div className={style.edit}>
                          <Link to={`/editar-produto/${produto.id}`}><FaRegEdit /></Link>
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
                      <button onClick={() => handleAumentarQuantidade(produto.id)}><IoIosAddCircleOutline /></button>
                      <span>{produto.quantity}</span>
                      <button onClick={() => handleDiminuirQuantidade(produto.id)}><GrSubtractCircle /></button>
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
