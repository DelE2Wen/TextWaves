import React, { useState } from "react";
import styles from "./Projeto.module.css";

const Projeto = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      const fileURL = URL.createObjectURL(file); // Pré-visualização do vídeo
      setVideoURL(fileURL);
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
      const response = await fetch("http://localhost:5000/process_video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Sucesso! Hash do vídeo: ${data.video_hash}`);
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

        {videoURL && (
          <div>
            <h2>Pré-visualização:</h2>
            <video src={videoURL} controls width="300" />
          </div>
        )}

        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default Projeto;
