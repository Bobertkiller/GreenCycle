# GreenCycle 🌱

GreenCycle é uma plataforma web que incentiva a reciclagem através de um sistema de pontos e recompensas. Os usuários podem acumular pontos ao reciclar materiais e trocá-los por produtos na loja virtual.

## Como Executar o Projeto 🚀

### Método 1: Usando Python para o servidor HTTP

1. Navegue até a pasta do frontend no terminal:
   ```bash
   cd frontend
   ```
2. Execute o servidor Python:
   ```python
   # Para Python 3.x
   python -m http.server 5500
   ```
3. Abra o navegador e acesse: `http://localhost:5500/welcome.html`

### Método 2: Usando Node.js

1. Instale o `live-server` globalmente:
   ```bash
   npm install -g live-server
   ```
2. Navegue até a pasta do frontend no terminal:
   ```bash
   cd frontend
   ```
3. Execute o live-server:
   ```bash
   live-server --open=welcome.html
   ```

### Método 3: Instalando Live Server no VSCode
1. Abra o VSCode
2. Clique no ícone de extensões (ou pressione Ctrl+Shift+X)
3. Pesquise por "Live Server"
4. Instale a extensão "Live Server" por Ritwick Dey
5. Reinicie o VSCode
6. Navegue até a pasta `frontend` no VSCode
7. Clique com o botão direito no arquivo `welcome.html`
8. Selecione "Open with Live Server"

### Configuração do Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o servidor Flask:
   ```bash
   python app.py
   ```

## Funcionalidades 🚀

- **Sistema de Login/Cadastro**: Autenticação segura de usuários
- **Perfil do Usuário**: Visualização de pontos e histórico
- **Loja Virtual**: Troca de pontos por produtos
- **Mapa Interativo**: Localização de pontos de coleta
- **Gerador de QR Code**: Geração de códigos para resgate de produtos
- **Produtos Resgatados**: Histórico de resgates
- **Guia do Site**: Tutorial interativo para novos usuários

## Tecnologias Utilizadas 💻

### Frontend
- HTML5
- CSS3
- JavaScript
- IntroJS (para o tutorial interativo)

### Backend
- Python
- Flask
- SQLite

## Estrutura do Projeto 📁

- Consulte estrutura.txt

## Endpoints da API 🔌

### Autenticação
- `POST /api/login` - Login de usuário
- `POST /api/signup` - Cadastro de usuário

### Usuário
- `GET /api/user/{id}/points` - Consulta pontos do usuário
- `POST /api/user/{id}/resgatar` - Resgata produto

### Produtos
- `GET /api/products` - Lista produtos disponíveis

## Requisitos do Sistema 💻

### Para o Frontend
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Node.js (opcional, para live-server)
- Python (opcional, para servidor HTTP simples)

### Para o Backend
- Python 3.x
- pip (gerenciador de pacotes Python)
- Dependências listadas em requirements.txt

## Solução de Problemas 🔧

1. **Erro CORS**
   - Certifique-se que o backend está rodando em `http://127.0.0.1:5000`
   - Verifique se o CORS está configurado no backend

2. **Erro ao carregar páginas**
   - Verifique se o servidor está rodando
   - Confirme se está usando a URL correta

3. **Problemas de login**
   - Limpe o localStorage do navegador
   - Verifique as credenciais
   - Confirme se o backend está respondendo

## Contribuindo 🤝

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença 📝

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato 📧

Link do Video testando - https://youtu.be/61f21qzAXtA

Link do Projeto: [https://github.com/Bobertkiller/GreenCycle](https://github.com/Bobertkiller/GreenCycle)
