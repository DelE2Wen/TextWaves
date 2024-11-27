import React, { useState } from "react";
import styles from "./Projeto.module.css";

const Projeto = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);

      const fileURL = URL.createObjectURL(file); //aqui crio url
      setVideoURL(fileURL);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!videoFile) {
      alert("Por favor, selecione um vídeo!");
      return;
    }
    alert("Vídeo carregado com sucesso!");
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
      </div>
    </div>
  );
};

export default Projeto;
