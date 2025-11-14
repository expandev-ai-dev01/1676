# NoteDB Backend API

Sistema minimalista para gerenciamento de notas com backend Node.js/TypeScript e SQL Server.

## Tecnologias

- Node.js
- TypeScript
- Express.js
- SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controllers da API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Utilitários
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados SQL Server

5. Execute as migrations do banco de dados

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Produção

```bash
npm start
```

## Endpoints da API

Base URL: `http://localhost:3000/api/v1`

### Health Check
- `GET /health` - Verifica status da API

### Notas (a serem implementados)
- `GET /internal/note` - Lista todas as notas
- `POST /internal/note` - Cria uma nova nota
- `GET /internal/note/:id` - Obtém uma nota específica
- `PUT /internal/note/:id` - Atualiza uma nota
- `DELETE /internal/note/:id` - Exclui uma nota

## Estrutura de Resposta

### Sucesso
```json
{
  "success": true,
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Segurança

- Helmet para headers de segurança
- CORS configurável
- Validação de entrada com Zod
- Multi-tenancy com isolamento por conta

## Licença

ISC