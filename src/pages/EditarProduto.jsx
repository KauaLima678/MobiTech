import style from "../styles/CadastroProduto.module.css";
import title from "../images/Logo.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowCircleLeft, FaArrowLeft } from "react-icons/fa";
import Header from "../components/Header";
import { BiImageAdd } from "react-icons/bi";
import { Upload } from "lucide-react";
import { FaRegTrashCan } from "react-icons/fa6";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemUrlAtual, setImagemUrlAtual] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const isValid =
    nome.trim() !== "" &&
    descricao.trim() !== "" &&
    preco !== "" &&
    (imagemFile !== null || imagemUrlAtual !== "") &&
    !isNaN(parseFloat(preco));

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/produtos/${id}`);
        const produto = res.data;
        setNome(produto.name);
        setDescricao(produto.description);
        setPreco(produto.price);
        setQuantidade(produto.quantity);
        setImagemUrlAtual(produto.imageUrl);
        setCategoriaId(produto.categoryId || "");

        if (produto.imageUrl) {
  setPreviewImage(`http://localhost:3333${produto.imageUrl}`);
}
      } catch (err) {
        setErro(err);
      }
    })();

    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, [id]);

  async function editarProduto(e) {
    e.preventDefault();

    let fileToSend = imagemFile;

    // Se não selecionou nova imagem, reusa a imagem atual da URL
    if (!imagemFile && imagemUrlAtual) {
      try {
        const response = await fetch(`http://localhost:3333${imagemUrlAtual}`);
        const blob = await response.blob();
        const fileName = imagemUrlAtual.split("/").pop();
        fileToSend = new File([blob], fileName, { type: blob.type });
      } catch (err) {
        console.error("Erro ao obter imagem atual:", err);
        setErro("Erro ao preparar imagem atual para envio.");
        return;
      }
    }

    if (!fileToSend) {
      alert("Erro: nenhuma imagem disponível para envio.");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileToSend);
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);
    formData.append("categoryId", categoriaId || "");

    try {
      setUploading(true);
      await api.patch(`/produtos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/produtos");
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      setErro("Erro ao editar produto.");
    } finally {
      setUploading(false);
    }
  }

  async function deletarProduto() {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      navigate("/produtos");
    } catch (err) {
      setErro(err.message);
    }
  }

  if (erro?.response?.status === 404) {
    return <h1>Produto não encontrado</h1>;
  }

  if (erro?.response?.status === 404) {
    return <h1>Produto não encontrado</h1>;
  }

  return (
    <>
      <Header />
      <div className={style.formContainer}>
        <form
          className={style.form}
          onSubmit={editarProduto}
        >
          <div className={style.uploadContainer}>
            <div
              className={style.imageUpload}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setImagemFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
            >
              {!previewImage ? (
                <>
                  <label className={style.imageIconContainer} htmlFor="imagem">
                    <BiImageAdd size={60} color="#fff" />
                  </label>
                  <h3>Adicionar Imagem</h3>
                  <label className={style.fileLabel} htmlFor="imagem">
                    <Upload size={20} style={{ marginRight: "5px" }} />
                    Selecionar Arquivo
                  </label>
                </>
              ) : (
                <>
                  <img
                    src={previewImage}
                    alt="Pré-visualização"
                    className={style.preview}
                  />
                  <label className={style.fileLabel} htmlFor="imagem">
                    <Upload size={20} style={{ marginRight: "5px" }} />
                    Trocar Imagem
                  </label>
                </>
              )}
              <input
                type="file"
                id="imagem"
                accept="image/*"
                className={style.fileInput}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImagemFile(file);
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                  } else {
                    setPreviewImage(null);
                  }
                }}
              />
            </div>
          </div>

          <div className={style.inputs}>
            {/* Inputs do formulário... */}
            <div className={style.inputCont}>
              <label htmlFor="nome">Nome do Produto</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className={style.inputCont}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div className={style.inputCont}>
              <label htmlFor="preco">Preço</label>
              <input
                type="number"
                step="0.01"
                id="preco"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
            <div className={style.inputCont}>
              <label htmlFor="quantidade">Quantidade</label>
              <input
                type="number"
                id="quantidade"
                min="0"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
              />
            </div>
            <div className={style.divSelect}>
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                className={style.selectCategoria}
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.botoes}>
              <button
                className={style.cancelar}
                type="button"
                onClick={() => navigate (-1)}
              >
                Cancelar
              </button>
              <button
                className={style.cadastrar}
                type="submit"
                disabled={!isValid || uploading}
              >
                {uploading ? "Salvando..." : "Confirmar"}
              </button>

              <button
              type="button"
                className={style.trash}
                onClick={() => deletarProduto(id)}
              >
                <FaRegTrashCan />
              </button>
            </div>
          </div>
        </form>
        {erro && <p className={style.aviso}>{erro}</p>}
      </div>
    </>
  );
}
