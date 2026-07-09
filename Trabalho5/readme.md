# Estágios INE — Como rodar localmente

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado e rodando
- [Docker Compose](https://docs.docker.com/compose/install/) (já vem junto no Docker Desktop)
- Sistema operacional **Linux** (o `network_mode: host` usado aqui não funciona no Mac/Windows)

---

## Subindo a aplicação

### 1. Suba os containers

```bash
docker compose up --build -d
```

Na primeira vez vai demorar alguns minutos porque o Docker precisa baixar as imagens e instalar as dependências. Nas próximas vezes, sem o `--build`, sobe em segundos:

```bash
docker compose up -d
```

### 2. Acesse no navegador

| Serviço  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost      |
| Backend  | http://localhost:4000 |
| MongoDB  | localhost:27017       |

---

## Parando a aplicação

Para parar sem apagar os dados:

```bash
docker compose down
```

Para parar **e apagar o banco de dados** (volume):

```bash
docker compose down -v
```

---

## Estrutura dos containers

```
projeto_local/
├── Dockerfile              # Backend (Node.js na porta 4000)
├── docker-compose.yml      # Orquestra os 3 serviços
├── app.js                  # Entrada da API
├── frontend/
│   └── Dockerfile          # Frontend (React + Nginx na porta 80)
└── ...
```

São 3 containers no total:

- **estagios-db** — MongoDB 6.0
- **estagios-backend** — API Node.js/Express
- **estagios-frontend** — React buildado servido pelo Nginx

---

## Problemas comuns

**Porta 80 ou 4000 já em uso**

Algum outro processo está usando a porta. Descubra qual com:

```bash
sudo lsof -i :80
sudo lsof -i :4000
```

Encerre o processo ou altere as portas no `docker-compose.yml`.

**Backend não conecta no MongoDB**

O backend espera o MongoDB estar saudável antes de subir, mas às vezes demora. Se der erro de conexão, tente:

```bash
docker compose restart backend
```

**Alterações no código não aparecem**

Rebuilde a imagem afetada:

```bash
docker compose up --build backend
# ou
docker compose up --build frontend
```

---

## Variáveis de ambiente

Definidas diretamente no `docker-compose.yml` para rodar local:

| Variável         | Valor padrão                                      |
| ---------------- | ------------------------------------------------- |
| `PORT`           | `4000`                                            |
| `MONGO_URI`      | `mongodb://root:rootpassword@localhost:27017/...` |
| `JWT_SECRET`     | `estagios-ine-jwt-secret-hardcoded-...`           |
| `JWT_EXPIRES_IN` | `30d`                                             |

---

## Rotas da API

### Autenticação — `/api/v1/auth`

| Método | Rota        | Descrição                 |
| ------ | ----------- | ------------------------- |
| POST   | `/cadastro` | Cria novo usuário         |
| POST   | `/login`    | Autentica e retorna JWT   |
| POST   | `/update`   | Atualiza dados do usuário |

### Estágios — `/api/v1/estagios`

| Método | Rota | Descrição               |
| ------ | ---- | ----------------------- |
| GET    | `/`  | Lista todos os estágios |
| POST   | `/`  | Cria nova vaga          |

### Mensagens — `/api/v1/mensagens`

| Método | Rota   | Descrição                      |
| ------ | ------ | ------------------------------ |
| GET    | `/`    | Lista todas as mensagens       |
| POST   | `/`    | Envia uma mensagem             |
| GET    | `/:id` | Mensagens de um usuário por ID |
