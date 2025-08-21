import style from '../styles/CadastroProduto.module.css'
import title from '../images/Logo.png'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowCircleLeft, FaArrowLeft } from 'react-icons/fa';


const api = axios.create({
  baseURL: "http://localhost:3333"
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
  
    const { id } = useParams();
    const navigate = useNavigate();
  
    const isValid = nome.trim() !== "" &&
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
        } catch (err) {
          setErro(err);
        }
      })();
  
      api.get("/categorias")
        .then(res => setCategorias(res.data))
        .catch(err => console.error("Erro ao buscar categorias:", err));
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
          }
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



  return (
    <>
    <div className={style.container}>
      <button className={style.back} onClick={() => navigate(-1)}><FaArrowCircleLeft /> Voltar</button>
      <form onSubmit={editarProduto}>
        <div className={style.titleImage}>
          <img src={title} alt="" />
        </div>
        <div className={style.inputs}>
          <input type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required placeholder='Digite o nome do Produto' />
          <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          placeholder='Descrição do produto'
        />
        <input
          type="number"
          id="quantidade"
          min="0"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
          <input type="number"
          step="0.01"
          id="preco"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
           placeholder='Adicionar Preço' />
          <select  id="categoria"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
            
          </select>
          <div className={style.file}>
            <input
          type="file"
          id="imagem"
          accept="image/*"
          onChange={(e) => setImagemFile(e.target.files[0])}
          required
          className={style.fileInput}
        />
          </div>
        </div>
        <div className={style.buttonCont}>
          <button type="submit" disabled={!isValid || uploading}>Cadastrar</button>
        </div>
      </form>
    </div>
    </>
  );
}
