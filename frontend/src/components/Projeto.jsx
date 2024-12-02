import React, { useState } from "react";
import styles from "./Projeto.module.css";

const Projeto = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [generatedVideoURL, setGeneratedVideoURL] = useState(""); // URL do vídeo gerado
  const [responseMessage, setResponseMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      const fileURL = URL.createObjectURL(file); // Pré-visualização do vídeo enviado
      setPreviewURL(fileURL);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      alert("Por favor, selecione um vídeo!");
      return;
    }

    // Configurar o FormData para envio de arquivo
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      // Fazendo a requisição para o backend
      const response = await fetch("http://127.0.0.1:5000/process_video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob(); // Recebe o vídeo como blob
        const videoURL = URL.createObjectURL(blob); // Cria uma URL a partir do blob
        setGeneratedVideoURL(videoURL);
        setResponseMessage("Vídeo processado com sucesso!");
      } else {
        const errorData = await response.json();
        setResponseMessage(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      setResponseMessage(`Erro de conexão: ${error.message}`);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.conteudoProjeto}>
        <h1>Upload de Vídeo</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="video/*" onChange={handleFileChange} />
          <button type="submit">Enviar</button>
        </form>

        {previewURL && (
          <div>
            <h2>Pré-visualização do Vídeo:</h2>
            <video src={previewURL} controls width="300" />
          </div>
        )}

        {generatedVideoURL && (
          <div>
            <h2>Vídeo Gerado:</h2>
            <video src={generatedVideoURL} controls width="300" />
          </div>
        )}

        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default Projeto;
