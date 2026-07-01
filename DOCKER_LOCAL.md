# Local Docker stack

The stack runs PostgreSQL, authentication, API gateway, and the frontend from
the latest GHCR images.

## Start

```bash
docker compose -f compose.local.yaml pull
docker compose -f compose.local.yaml up -d
docker compose -f compose.local.yaml ps
```

## URLs

- Frontend: `http://localhost:3001`
- API gateway: `http://localhost:8080`
- Auth service: `http://localhost:8081`
- PostgreSQL: `localhost:5433`

## Stop

```bash
docker compose -f compose.local.yaml down
```

The PostgreSQL data remains in the named `postgres_data` volume. All services
use `restart: unless-stopped`, so they restart when Docker Desktop starts.
