# CNEISI App

Aplicación web para gestionar el congreso CNEISI: usuarios, whitelist, eventos e inscripciones.

- **Backend:** Express + Sequelize + SQLite (`CNEISI-APP-BACKEND`)
- **Frontend:** React + Vite + React Router + Axios (`CNEISI-APP-FRONTEND`)

## Inicio rápido

### 1. Backend

```bash
cd CNEISI-APP-BACKEND
npm install
npm run seed    # Crea usuarios, whitelist y eventos de prueba
npm run dev     # http://localhost:3000
```

### 2. Frontend

```bash
cd CNEISI-APP-FRONTEND
npm install
npm run dev     # http://localhost:5173 (proxy /api → backend)
```

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Superadmin | `superadmin@cneisi.test` | `superadmin123` |
| Admin | `admin@cneisi.test` | `admin123` |
| Participante | `participante@cneisi.test` | `participante123` |

Emails en whitelist (sin cuenta aún): `alumno1@cneisi.test`, `alumno2@cneisi.test`

Para resetear datos: `npm run seed` en el backend (recrea la base desde cero).

## Rutas del frontend

| Ruta | Rol |
|------|-----|
| `/participant` | Participante — perfil y QR |
| `/participant/timeline` | Participante — cronograma e inscripción |
| `/participant/inscriptions` | Participante — mis inscripciones |
| `/scanner` | Admin / Superadmin — escáner (placeholder) |
| `/management/*` | Superadmin — panel de gestión |
| `/management/whitelist` | Superadmin — CRUD lista blanca |

## API principal

Todas las rutas protegidas requieren header `Authorization: Bearer <token>`.

| Recurso | Acceso |
|---------|--------|
| `POST /api/Authentications` | Público — login, devuelve JWT |
| `POST /api/Usuarios` | Público — registro (requiere whitelist) |
| `GET/POST/PUT/DELETE /api/Whitelist` | Superadmin |
| `GET/POST/PUT/DELETE /api/Usuarios` | Superadmin (POST `/admin` para crear admins) |
| `GET /api/Eventos` | Público |
| `POST/PUT/DELETE /api/Eventos` | Superadmin |
| `GET/POST/DELETE /api/Inscripciones` | Autenticado (participante: propias) |
| `POST /api/Asistencias/validar` | Admin / Superadmin — validar email para actividad |
| `POST /api/Asistencias/manual` | Admin / Superadmin — registrar asistencia manual |

## Permisos por rol

- **Participante:** cronograma, inscripciones propias (email debe estar en whitelist)
- **Admin:** escáner QR (placeholder)
- **Superadmin:** whitelist, admins, actividades, métricas, escáner

## Estructura simplificada

```
CNEISI-APP-BACKEND/
  app.js, seed.js
  models/       Usuario, Evento, Inscripcion, Whitelist
  routes/       Usuarios, Eventos, Inscripciones, Whitelist, Authentications
  middleware/   auth, requireRole, validate

CNEISI-APP-FRONTEND/src/
  api/client.js           # Instancia Axios + JWT
  context/AuthContext.jsx # Sesión mínima
  routes/AppRoutes.jsx    # React Router + guards
  pages/                  # Páginas por rol
  components/layout/      # ParticipantLayout, ManagementLayout
  components/ui/          # PageShell, EmptyState, Toast, ConfirmDialog
```

## Scripts útiles

```bash
# Backend
npm run dev
npm run seed

# Frontend
npm run dev
npm run build
npm run lint
```
