# Backend Filmes

Três serviços sobem por Docker Compose na raiz deste repositório.

## Estrutura

```text
api/                 Spring Boot (Java 17)
db/init/             SQL da primeira inicialização do Postgres
web/                 HTML, CSS e JavaScript servidos pelo nginx
docker-compose.yml
.env.example
```

## Banco

O serviço `db` usa a imagem `postgres:16-alpine`. Nenhum Dockerfile próprio.

- Credenciais: `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD`, lidas do `.env`. Sem esse arquivo, os três valores caem em `filmes`.
- Volume `pgdata` guarda os dados.
- `db/init/01-filmes.sql` cria a tabela `filmes` com as colunas da entidade: `id`, `titulo`, `genero` (`varchar(255) array`), `nota` (`bytea`) e `ano`. O script entra em `/docker-entrypoint-initdb.d` e só roda na primeira criação do volume.
- No host: `5433` → `5432` do container. A API no Compose usa o hostname `db` na rede `filmes`.
- O healthcheck usa `pg_isready`. O serviço `api` só inicia depois que o banco responde.

## API

A API usa PostgreSQL. Em `application.properties` a URL padrão aponta para `localhost:5433`. No Compose, `SPRING_DATASOURCE_URL` sobrescreve para `jdbc:postgresql://db:5432/filmes`.

`spring.jpa.hibernate.ddl-auto=validate`: o Hibernate não cria tabelas; o SQL em `db/init` define o esquema.

Base: `/filmes`

| Método | Caminho | Efeito |
| --- | --- | --- |
| `GET` | `/filmes` | lista todos |
| `POST` | `/filmes` | cria e responde `201` |
| `PUT` | `/filmes/{id}` | atualiza o id informado |
| `DELETE` | `/filmes/{id}` | remove um |
| `DELETE` | `/filmes` | remove todos |

No `POST`, não envie `id`. O banco gera o valor.

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
| `db` | `5433` → `5432` |
| `api` | `5000` → `8080` |
| `web` | `8080` → `80` |

- Site: [http://localhost:8080](http://localhost:8080)
- API: [http://localhost:5000/filmes](http://localhost:5000/filmes)

## API sem Docker

Com o Postgres do Compose no ar (`docker compose up -d db`):

```bash
cd api
./mvnw spring-boot:run
```

A API sobe na porta `8080` e conecta em `localhost:5433`.
