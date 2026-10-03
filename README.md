# Backend Filmes

Três serviços sobem por Docker Compose na raiz deste repositório. O projeto Spring Boot foi apenas movido para `api/`. O código da API não foi alterado.

## Estrutura

```text
api/                 projeto Maven, como estava
db/init/             SQL da primeira inicialização do Postgres
web/                 frontend novo: HTML, CSS e JavaScript
docker-compose.yml
.env.example
```

Na raiz ficam a orquestração e as três pastas. `pom.xml`, `mvnw` e `src` estão em `api/`.

## Banco

O serviço `db` usa a imagem `postgres:16-alpine`. Nenhum Dockerfile próprio.

- Credenciais: `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD`, lidas do `.env`. Sem esse arquivo, os três valores caem em `filmes`.
- Volume `pgdata` guarda os dados.
- `db/init/01-filmes.sql` cria a tabela `filmes` com as colunas da entidade: `id`, `titulo`, `genero` (`varchar(255) array`), `nota` (`bytea`) e `ano`. O script entra em `/docker-entrypoint-initdb.d` e só roda na primeira criação do volume.
- A porta do Postgres não é publicada no host. O serviço fica na rede `filmes`.
- O healthcheck usa `pg_isready`. O serviço `api` só inicia depois que o banco responde.

## Web

O serviço `web` é um nginx. O Dockerfile copia `index.html`, `css/`, `js/` e `nginx.conf`.

- No host: [http://localhost:8080](http://localhost:8080)
- No container: porta `80`
- O nginx entrega os arquivos estáticos. Ainda não há proxy para a API.
- A página em `web/` pede `GET /filmes` na mesma origem. Enquanto o proxy não existir, essa lista não é preenchida.

## Subir

```bash
cp .env.example .env
docker compose up --build
```

| Serviço | Publicação no host |
| --- | --- |
| `db` | nenhuma |
| `api` | `5000` → porta `8080` do container |
| `web` | `8080` → porta `80` do container |

A aplicação dentro de `api/` continua na porta que já usava. O `5000` é só o mapeamento do Compose, sem mudança em `application.properties`.
