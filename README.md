<h1 align="center">
   CRT API Terminal
</h1>

<p align="center">
   <img alt="Top language" src="https://img.shields.io/github/languages/top/ThiagoBRG60/CRT-API-Terminal?style=flat-square&color=00ffaa"/>
   <img alt="Language Count" src="https://img.shields.io/github/languages/count/ThiagoBRG60/CRT-API-Terminal?style=flat-square&color=00ffaa"/>
   <img alt="Repository Size" src="https://img.shields.io/github/repo-size/ThiagoBRG60/CRT-API-Terminal?style=flat-square&color=00ffaa"/>
   <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ThiagoBRG60/CRT-API-Terminal?style=flat-square&color=00ffaa"/>
   <img alt="GitHub forks" src="https://img.shields.io/github/forks/ThiagoBRG60/CRT-API-Terminal?style=flat-square&color=00ffaa"/>
   <a href="https://github.com/ThiagoBRG60/CRT-API-Terminal/tree/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/ThiagoBRG60/CRT-API-Terminal?style=flat-square&color=00ffaa"/>
   </a>
</p>

## 📝 Descrição

Uma aplicação que simula um terminal interativo em um monitor CRT retrô. Nesse projeto, o usuário pode executar comandos diretamente no terminal e acessar rotas de API próprias, que retornam informações sobre arquivos, sistema operacional, compressão e descompressão, entre outras funcionalidades. Exibindo todos os resultados em tempo real na tela.

O servidor, desenvolvido em Node.js, fornece as rotas de API que retornam dados formatados para exibição no terminal, enquanto a interface, construída com HTML, CSS e JavaScript, oferece uma experiência leve, visualmente retrô e totalmente interativa.

## 🚀 Funcionalidades

- Execução de comandos diretamente no terminal.
- Interação com rotas de API para consulta de arquivos, sistema, hashes, e muito mais.
- Simulação de terminal retrõ em estilo CRT.

## 💻 Tecnologias

**Frontend:**
- HTML
- CSS
- Javascript

**Backend:**
- Node.js

## 📚 Bibliotecas

- Figlet: Para a geração de arte ASCII

## ⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de que você tenha instalado:

- **Node.js** (recomendado versão 18.x ou superior)
- **npm** (gerenciador de pacotes do Node.js) ou **yarn**

Para verificar se você tem o Node.js e o npm instalados, execute:

```bash
node -v
npm -v
```

Se você não tiver o Node.js instalado, você pode baixá-lo aqui: https://nodejs.org.

Se preferir usar o yarn, você pode instalá-lo globalmente com:

```bash
npm install -g yarn
```

## 🛠️ Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/ThiagoBRG60/CRT-API-Terminal.git
```
2. Navegue até a pasta do projeto e instale as dependências:
```bash
npm install
```
3. Inicie o servidor:
```
npm start
```
4. Abra o navegador e acesse a aplicação: [http://localhost:3000](http://localhost:3000).

## 📁 Estrutura do Projeto

- **server.js**: Arquivo principal do servidor e funções auxiliares (como `returnResponse` e `responseMiddleware`).
- data/: Contém arquivos de configuração e dados:
  - **apiRoutes.js**: Definições das rotas e seus handlers.
  - **mimeTypes.js**: Mapeamento de extensões de arquivo para tipos MIME.
  - **paperText.js**: Textos estáticos da interface servindo como guia do usuário.
- **utils/**: Funções utilitárias para manipulação de dados (como transformação de respostas e validação de JSON).
- **public/**: Diretório com os arquivos estáticos da interface (HTML, CSS, JS e assets)

## 🔧 Formato Comum de Resposta JSON

A maioria das rotas retorna respostas no seguinte formato:

```json
{
   "route": "nome_da_rota",
   "data": [
      {
         "title": "titulo_da_secao",
         "titleSuffix": "sufixo_do_titulo", // opcional
         "hasColon": true | false,
         "body": [
            {"label": "etiqueta", "value": "valor"}
         ]
      }
   ]
}
```

**Observações**:
- A propriedade `titleSuffix` é opcional.
- O campo `body` pode ser um array de objetos ou uma string simples, dependendo da rota.

## 🌍 Rotas Disponíveis

**GET**:
- `/files`
   - **Descrição**: Lista arquivos e pastas em um diretório.
   - **Parâmetros obrigatórios**: path (caminho relativo).
   - **Exemplo**:
   ```bash
   curl "http://localhost:3000/files?path=./data"
   ```
- `/file`
   - **Descrição**: Retorna metadados e conteúdo de um arquivo.
   - **Parâmetros obrigatórios**: path (caminho para o arquivo).
   - **Exemplo**:
   ```bash
   curl "http://localhost:3000/file?path=./data/mimeTypes.js"
   ```
- `/hash`
   - **Descrição**: Calcula o hash SHA-256 de um arquivo.
   - **Parâmetros obrigatórios**: path (caminho para o arquivo).
   - **Exemplo**:
   ```bash
   curl "http://localhost:3000/hash?path=./data/paperText.js"
   ```
- `/system`
   - **Descrição**: Retorna informações do sistema (CPU, memória, SO, uptime).
   - **Exemplo**:
   ```bash
   curl "http://localhost:3000/system"
   ```
**POST**:
- `/compress`
   - **Descrição**: Compacta um arquivo usando GZIP.
   - **Body (JSON)**: Metadados do arquivo e conteúdo em formato base64.
   - **Exemplo**:
   ```bash
   curl -X POST "http://localhost:3000/compress" -H "Content-Type: application/json" -d '{"name": "arquivo.txt", "size": 12345, "content": "<base64>"}'
   ```
- `/decompress`
   - **Descrição**: Descompacta um arquivo GZIP.
   - **Body (JSON)**: Metadados do arquivo e conteúdo em formato base64.
   - **Exemplo**:
   ```bash
   curl -X POST "http://localhost:3000/decompress" -H "Content-Type: application/json" -d '{"name": "arquivo.txt.gz", "size": 12345, "content": "<base64>"}'
   ```
- `/figlet`
   - **Descrição**: Converte texto em arte ASCII.
   - **Body (text/plain)**: Texto a ser convertido.
   - **Exemplo**:
   ```bash
   curl -X POST "http://localhost:3000/figlet" -H "Content-Type: text/plain" -d "Texto"
   ```

## 📝 Boas Práticas de Desenvolvimento

- Padronize as respostas `JSON` para garantir compatibilidade com o frontend.
- Use as funções utilitárias em `utils/` para evitar duplicação de código.
- Mantenha as extensões de arquivos registradas corretamente em `mimeTypes.js`.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir com o projeto, siga esses passos:

1. Faça um fork do repositório.
   
2. Crie uma branch para a sua feature ou alteração: `git checkout -b nome-da-sua-branch`.
   
3. Faça suas alterações, adicione e dê commit: `git add .` e `git commit -m 'mensagem de commit'`.
   
4. Envie suas alterações para o repositório forkado: `git push origin nome-da-sua-branch`.
   
5. Crie um pull request no GitHub para o repositório principal.

## 📬 Contato

Caso tenha alguma dúvida, entre em contato comigo pelo meu email:

<a href="mailto:thiagocorreadev@gmail.com" title="Gmail">
   <img src="https://img.shields.io/badge/-Gmail-FF0000?style=flat-square&labelColor=FF0000&logo=gmail&logoColor=white" alt="Gmail"/>
</a>

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

<br>

⭐ Se este projeto te ajudou, considere deixar uma estrela no repositório!