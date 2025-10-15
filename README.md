# Acquisitions API

API REST minimalista para autenticación y endpoints de prueba de estado de la aplicación, construida con Node.js, Express y Drizzle ORM.

## Tecnologías
- Node.js 20
- Express 5
- Drizzle ORM + Neon (PostgreSQL serverless)
- Zod (validación)
- Winston + Morgan (logging)
- Docker (deploy)
- GitHub Actions (CI/CD)

## Estructura del proyecto
```
src/
  app.js            # Inicialización de Express y middlewares
  server.js         # Arranque de servidor
  index.js          # Punto de entrada
  routes/
    auth.routes.js  # Rutas de autenticación
  controllers/
    auth.controller.js
  services/
    auth.service.js
  validations/
    auth.validation.js
  models/
    user.model.js
  config/
    database.js     # Config Drizzle + Neon
    logger.js       # Logger Winston
    arcjet.js       # Seguridad (Arcjet)
  middleware/
    security.middleware.js
```

## Requisitos previos
- Node.js 20+
- Docker (opcional, para empaquetado)
- Cuenta/DB en Neon o cualquier PostgreSQL accesible

## Variables de entorno
Crea un `.env` basado en `.env.example`:
```
PORT=3000
NODE_ENV=development
ARCJET_KEY=replace-with-your-arcjet-key
JWT_SECRET=replace-with-strong-secret
DATABASE_URL=postgres://user:password@host:5432/dbname
```

## Scripts npm
- `npm run dev`: arranque con watch (`src/index.js`)
- `npm start`: arranque normal
- `npm run lint`: lint con ESLint
- `npm run format`: formateo Prettier
- `npm run db:generate`: generar migraciones (drizzle-kit)
- `npm run db:migrate`: aplicar migraciones
- `npm run db:studio`: abrir Drizzle Studio

## Puesta en marcha local
```sh
npm ci
npm run dev
# En otra terminal
curl -s http://localhost:3000/health
```

Si quieres desactivar la seguridad (por ejemplo en pruebas locales):
```sh
DISABLE_SECURITY=true ARCJET_KEY=dummy node src/index.js
```

## Endpoints
- `GET /` → texto plano de bienvenida
- `GET /health` → `{ status: 'ok', timestamp, uptime }`
- `GET /api` → `{ message: 'Welcome to the Acquisitions API' }`
- `POST /api/auth/sign-up` → crea usuario
  - body JSON: `{ name, email, password, role? }`
  - 201 con `{ user: { id, name, email, role } }` y cookie `token`

> Nota: `sign-in` y `sign-out` existen como placeholders.

## Docker
Construcción y ejecución:
```sh
docker build -t acquisitions:local .
docker run --rm -p 3000:3000 --env-file .env acquisitions:local
# o replicando CI
docker run --rm -p 3000:3000 --env-file .env \
  -e DISABLE_SECURITY=true -e ARCJET_KEY=dummy-ci-key acquisitions:local
```

## CI/CD
Este repo incluye pipelines:
- CI: lint, build Docker y smoke test de `/health`.
- CD: publica imagen en GHCR y despliegue remoto opcional por SSH.

Detalles y configuración de secretos en `README-CICD.md`.

## Notas y troubleshooting
- Si `curl -sf` devuelve código 22, quita `-f` para ver el error.
- En Linux, si Docker muestra `permission denied` al acceder a `/var/run/docker.sock`, añade tu usuario al grupo `docker` y reinicia el servicio (ver `README-CICD.md`).
- Logger: asegúrate de que el directorio `logs/` exista; el Dockerfile lo crea automáticamente.
