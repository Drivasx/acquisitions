# CI/CD básico con GitHub Actions

Este repo ahora incluye un pipeline de CI y CD mínimos para la API Node.js.

## CI (`.github/workflows/ci.yml`)
- Se ejecuta en push y PR a `main`.
- Pasos: checkout, Node 20 + cache npm, `npm ci`, `npm run lint`, build de imagen Docker y smoke test de `/health`.

Requisitos:
- `package-lock.json` presente (ya incluido) para usar `npm ci`.
- Endpoint `/health` (ya implementado) para el smoke test.

## CD (`.github/workflows/cd.yml`)
- En push a `main` o manual (`workflow_dispatch`).
- Construye y publica imagen en GitHub Container Registry (GHCR) con tags `latest` (solo en rama por defecto) y `sha`.
- Paso opcional de despliegue remoto por SSH si configuras secretos.

### Imagen en GHCR
- Nombre: `ghcr.io/<owner>/<repo>`.
- Requiere permisos `packages: write` (ya definidos en el workflow) y que el paquete tenga visibilidad adecuada.

### Secrets necesarios
Configura en Settings → Secrets and variables → Actions:
- Opcional (para despliegue remoto):
  - `SSH_HOST`: host o IP del servidor.
  - `SSH_USER`: usuario SSH.
  - `SSH_PRIVATE_KEY`: clave privada (formato OpenSSH) con acceso al servidor.
  - En el servidor remoto, crea `/opt/acquisitions/.env` con las variables necesarias (PORT, claves, DB, etc.).

> Nota: Para que el servidor pueda hacer `docker login ghcr.io`, `GITHUB_TOKEN` del workflow se utiliza automáticamente; en remoto puedes usar un PAT si lo prefieres.

## Dockerfile y .dockerignore
- `Dockerfile` simple basado en `node:20-bookworm-slim`, instala deps con `npm ci --omit=dev` y ejecuta `node src/index.js`.
- `.dockerignore` para reducir el contexto de build.

## Run localmente (opcional)
Puedes construir y correr la imagen local:

```bash
# Construir
docker build -t acquisitions:local .
# Ejecutar
docker run --rm -p 3000:3000 --env-file .env acquisitions:local

# Si quieres replicar el entorno del CI (bypass de seguridad):
docker run --rm -p 3000:3000 --env-file .env \
  -e DISABLE_SECURITY=true -e ARCJET_KEY=dummy-ci-key acquisitions:local
```

## Notas
- Los logs se escriben en `logs/` por Winston; dentro del contenedor se crea el directorio automáticamente.
- Ajusta el mapeo de puertos y el archivo `.env` según tus necesidades.