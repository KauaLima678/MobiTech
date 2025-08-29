import style from "../styles/categorias.module.css";
import Header from "../components/Header";
import axios from "axios";
import { LuBox } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEdit, FaTag } from "react-icons/fa";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { MdAdd } from "react-icons/md";
import Footer from "../components/Footer";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // --- Estados para o Modal de CADASTRO ---
  const [cadastroModal, setCadastroModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  // --- Estados para o Modal de EDIÇÃO ---
  const [editarModal, setEditarModal] = useState(false);
  const [categoriaId, setCategoriaId] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:3333",
  });

  // --- Efeitos para buscar dados da API ---
  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
    api.get("/produtos").then((res) => setProdutos(res.data));
  }, []);

  // --- Funções do Modal de CADASTRO ---
  function abrirCadastro() {
    setCadastroModal(true);
  }
  function fecharCadastro() {
    setCadastroModal(false);
  }

  // --- Funções do Modal de EDIÇÃO ---
  const openEditModal = (categoria) => {
    setCategoriaId(categoria.id);
    setNome(categoria.name);
    setDescricao(categoria.description);
    setEditarModal(true);
  };

  async function handleEdicaoSubmit(e) {
    e.preventDefault();
    try {
      await api.put(`/categorias/${categoriaId}`, {
        name: nome,
        description: descricao,
      });
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === categoriaId
            ? { ...c, name: nome, description: descricao }
            : c
        )
      );
      setEditarModal(false); // <-- CORREÇÃO CRÍTICA: Fecha o modal correto
    } catch (err) {
      setErro(err.response?.data?.mensagem || err.message);
    }
  }

  const categoriasFilter = categorias.filter((categoria) =>
    categoria.name.toLowerCase().includes(busca.toLowerCase())
  );

  async function deletarCategoria(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;
    try {
      await api.delete(`/categorias/${id}`);
      setCategorias((prev) => prev.filter((categoria) => categoria.id !== id));
    } catch (err) {
      setErro(err.message);
    }
  }

  const getContagemDeProdutos = (idDaCategoria) => {
    return produtos.filter((produto) => produto.categoryId === idDaCategoria)
      .length;
  };

  const isValid = novoNome.trim() !== "" && novaDescricao.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/categorias", {
        name: novoNome,
        description: novaDescricao,
      });

      setCategorias((listaAtual) => [...listaAtual, res.data]);
      navigate("/categorias");

      setNovoNome("");
      setNovaDescricao("");
      setCadastroModal(false);
      setErro("");
    } catch (err) {
      setErro(err.message);
      console.log(erro);
    }
  }

  return (
    <>
      <Header setBusca={setBusca} busca={busca} />

      <div className={style.sectionTags}>
        <div className={style.HeaderCards}>
          <div className={style.cardHeader}>
            <div className={style.top}>
              <h1>Total de Categorias</h1>
              <span>
                <LuBox />
              </span>
            </div>
            <div className={style.total}>
              <span>{categorias.length}</span>
              <p>Categorias Ativas</p>
            </div>
          </div>
          <div className={style.cardHeader}>
            <div className={style.top}>
              <h1>Total de Produtos</h1>
              <span>
                <HiArrowTrendingUp />
              </span>
            </div>
            <div className={style.total}>
              <span>{produtos.length}</span>
              <p>em todas as categorias</p>
            </div>
          </div>
          <div className={style.cardAdd}>
            <div className={style.addTag}>
              <h2>Adicionar nova categoria</h2>
            </div>
            <button onClick={abrirCadastro}>
              <MdAdd />
            </button>
            <span className={style.tagText}>
              Organize melhor seus produtos criando novas categorias
              personalizadas
            </span>
          </div>
        </div>

        <div className={style.categorias}>
          <h1 className={style.sectionTitle}>Categorias Cadastradas</h1>

          <div className={style.gridCategorias}>
            {categoriasFilter.length === 0 ? (
              <div className={style.nullTag}>
                {" "}
                <FaTag /> Nenhuma categoria foi cadastrada.
              </div>
            ) : (
              categoriasFilter.map((categoria) => (
                <div className={style.categoria} key={categoria.id}>
                  <div className={style.headerTag}>
                    <div className={style.titleTag}>
                      <h2>{categoria.name}</h2>
                    </div>
                    <div className={style.btn}>
                      <button
                        className={style.edit}
                        onClick={() => openEditModal(categoria)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deletarCategoria(categoria.id)}
                        className={style.delete}
                      >
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </div>

                  <div className={style.description}>
                    <p>{categoria.description}</p>

                    <div className={style.actions}>
                      <span>
                        {getContagemDeProdutos(categoria.id)} produto(s)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {cadastroModal && (
        <div className={style.overlay} onClick={() => setCadastroModal(false)}>
          <form
            className={style.form}
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Cadastrar Categoria</h1>
            <div className={style.inputs}>
              <div className={style.inputCont}>
                <label htmlFor="nome">Nome da Categoria</label>
                <input
                  type="text"
                  id="nome"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  required
                />
              </div>
              <div className={style.inputCont}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  required
                />
              </div>
              <div className={style.botoes}>
                <button
                  className={style.cancelar}
                  type="button"
                  onClick={fecharCadastro}
                >
                  Cancelar
                </button>
                <button className={style.cadastrar} type="submit">
                  Cadastrar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {editarModal && (
        <div className={style.overlay} onClick={() => setEditarModal(false)}>
          <form
            className={style.form}
            onSubmit={handleEdicaoSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Editar Categoria</h1>
            <div className={style.inputs}>
              <div className={style.inputCont}>
                <label htmlFor="nome-edicao">Nome da Categoria</label>
                {/* CORRIGIDO: Usando 'nome' e 'setNome' */}
                <input
                  type="text"
                  id="nome-edicao"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className={style.inputCont}>
                <label htmlFor="desc-edicao">Descrição</label>
                <textarea
                  id="desc-edicao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                />
              </div>
              <div className={style.botoes}>
                <button
                  className={style.cancelar}
                  type="button"
                  onClick={() => setEditarModal(false)}
                >
                  Cancelar
                </button>
                <button className={style.cadastrar} type="submit">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </>
  );
}
