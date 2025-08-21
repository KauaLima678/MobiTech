import axios from "axios";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import style from "../styles/CadastroProduto.module.css";
import Header from "../components/Header";
import { BiImageAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export default function CadastroProduto({ onClose }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [imagemFile, setImagemFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

  const isValid =
    nome.trim() !== "" &&
    descricao.trim() !== "" &&
    preco !== "" &&
    imagemFile !== null &&
    !isNaN(parseFloat(preco));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imagemFile) {
      setErro("Selecione uma imagem antes de salvar.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imagemFile); // precisa ser "image" por causa do upload.single("image")
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("price", preco);
    formData.append("quantity", quantidade);
    formData.append("categoryId", categoriaId || "");

    try {
      setUploading(true);
      await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/produtos");
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErro("Erro ao salvar produto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Header />
      <div className={style.formContainer}>
        <form className={style.form} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
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
                    <BiImageAdd size={60} color='#fff'/>
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
              <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className={style.inputCont}>
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
            </div>
            <div className={style.inputCont}>
              <label htmlFor="preco">Preço</label>
              <input type="number" step="0.01" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required />
            </div>
            <div className={style.inputCont}>
              <label htmlFor="quantidade">Quantidade</label>
              <input type="number" id="quantidade" min="0" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
            </div>
            <div className={style.divSelect}>
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" className={style.selectCategoria} value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
                ))}
              </select>
            </div>
            <div className={style.botoes}>
              <button className={style.cancelar} type="button" onClick={onClose}>Cancelar</button>
              <button className={style.cadastrar} type="submit" disabled={!isValid || uploading}>
                {uploading ? "Salvando..." : "Cadastrar"}
              </button>
            </div>
          </div>
        </form>
        {erro && <p className={style.aviso}>{erro}</p>}
      </div>
    </>
  );
}