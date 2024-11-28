from flask import Flask, request, jsonify
from utils.generateStrFileVideo import generate_str_file_and_video
import os
import uuid
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Diretório para armazenar os vídeos enviados
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Cria a pasta 'uploads' se não existir
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Diretório do backend (já está correto)
BACKEND_DIRECTORY = "C:\\Users\\Dell\\Desktop\\TexWave-main\\backend"

@app.route('/open-api', methods=['GET'])
def open_api():
    return jsonify({"message": "Access granted to everyone!"})

@app.route('/process_video', methods=['POST'])
def process_video():
    try:
        # Verificar se há um arquivo de vídeo no request
        if 'video' not in request.files:
            return jsonify({'status': 'error', 'message': "Nenhum arquivo de vídeo enviado!"}), 400

        video_file = request.files['video']  # Obtendo o arquivo enviado
        if video_file.filename == '':
            return jsonify({'status': 'error', 'message': "Nenhum arquivo selecionado!"}), 400

        # Salvando o arquivo de vídeo no diretório de uploads
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_file.filename)
        video_file.save(video_path)

        # Gerando um nome aleatório para o arquivo de saída
        output_video_name = f"{uuid.uuid4().hex}.mp4"

        # Chamando a função para gerar o arquivo .str e vídeo
        str_file_path, output_video_path, video_hash = generate_str_file_and_video(video_path, BACKEND_DIRECTORY, output_video_name)

        # Preparando a resposta com o caminho dos arquivos gerados e o hash do vídeo
        response = {
            'status': 'success',
            'video_hash': video_hash,
            'str_file': str_file_path,
            'output_video': output_video_path
        }
        return jsonify(response), 200  # Retornando resposta com status 200 (OK)

    except Exception as e:
        # Caso ocorra algum erro, retornamos uma resposta de erro
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
