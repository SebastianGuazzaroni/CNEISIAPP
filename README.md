# CNEISIS APP

## Descripción

CNEISIS APP es una aplicación web para administrar eventos, usuarios e inscripciones. El proyecto está dividido en dos partes:

- `CNEISI-APP-BACKEND`: API REST en Node.js con Express y Sequelize.
- `CNEISI-APP-FRONTEND`: interfaz de usuario en React con Vite.

Esta versión del proyecto está en desarrollo y contiene las bases de la aplicación, incluyendo modelos de usuarios, eventos e inscripciones, junto con rutas principales y componentes base del frontend.

## Estructura del proyecto

```
README.md
CNEISI-APP-BACKEND/
  app.js
  package.json
  models/
    Event.js
    Inscription.js
    User.js
    index.js
  routes/
    Authentications.js
    Events.js
    Inscriptions.js
    Users.js
CNEISI-APP-FRONTEND/
  package.json
  vite.config.js
  public/
  src/
    App.jsx
    main.jsx
    index.css
    components/
      eventCard.jsx
      eventForm.jsx
      eventList.jsx
      loginForm.jsx
      registerForm.jsx
      QRScanner.jsx
    pages/
      events.jsx
      layout.jsx
      login.jsx
      register.jsx
      userProfile.jsx
      QRCodeView.jsx
      QRScanner.jsx
```

## Tecnologías usadas

### Backend

- Node.js
- Express
- Sequelize
- SQLite
- CORS
- express-validator
- nodemon (desarrollo)

### Frontend

- React
- Vite
- react-router-dom
- ESLint

## Instalación

1. Clonar el repositorio.
2. Instalar dependencias en cada carpeta:

```bash
cd "CNEISI APP Desarrollo software\CNEISI-APP-BACKEND"
npm install

cd "..\CNEISI-APP-FRONTEND"
npm install
```

## Ejecución

### Backend

```bash
cd "CNEISI APP Desarrollo software\CNEISI-APP-BACKEND"
npm run dev
```

El servidor arranca en `http://localhost:3000` y crea automáticamente la base de datos SQLite local.

### Frontend

```bash
cd "CNEISI APP Desarrollo software\CNEISI-APP-FRONTEND"
npm run dev
```

El frontend corre con Vite en un puerto local que puede variar (por defecto `http://localhost:5173`).

## API disponible

### Usuarios

- `GET /api/Usuarios` - lista todos los usuarios (sin contraseña)
- `GET /api/Usuarios/:id` - obtiene un usuario por su id
- `POST /api/Usuarios` - crea un nuevo usuario

### Eventos

- `GET /api/Eventos` - lista todos los eventos
- `GET /api/Eventos/:id` - obtiene un evento por id
- `POST /api/Eventos` - crea un evento nuevo

### Inscripciones

- `GET /api/Inscripciones` - lista inscripciones con datos del usuario y evento
- `GET /api/Inscripciones/:id` - obtiene una inscripción por id
- `POST /api/Inscripciones` - crea una inscripción

### Autenticación

- `CNEISI-APP-BACKEND/routes/Authentications.js` está presente pero vacío; aún no hay flujo de login autenticado implementado.

## Modelos de datos

### Usuario

- `id` (INTEGER, auto increment)
- `nombreApellido` (STRING)
- `email` (STRING, único)
- `password` (STRING)

### Evento

- `fecha` (DATE)
- `sala` (STRING)
- `cupoMaximo` (INTEGER)
- `titulo` (STRING)
- `descripcion` (STRING)
- `orador` (STRING)
- `cupoDisponible` (INTEGER)

### Inscripción

- `id` (INTEGER, auto increment)
- `fechaInscripcion` (DATE)
- `estado` (STRING)
- `eventoId` (INTEGER)
- relación con `Usuario` e `Evento`

## Características actuales

- API REST básica para usuarios, eventos e inscripciones
- Estructura de base de datos SQLite mediante Sequelize
- Frontend en React con componentes para formularios y lista de eventos
- Flujo inicial de registro/login en componentes separados

## Tareas futuras

- [ ] Implementar autenticación real (login / registro con tokens JWT)
- [ ] Completar `routes/Authentications.js`
- [ ] Mejorar validaciones del backend y manejo de errores
- [ ] Agregar roles de usuario (administrador / participante)
- [ ] Implementar edición y eliminación de eventos, usuarios e inscripciones
- [ ] Añadir protección de rutas en el frontend
- [ ] Completar páginas vacías de `src/pages` y componentes faltantes
- [ ] Agregar tests unitarios e integrados para backend y frontend
- [ ] Crear diseño responsive y estilo visual consistente
- [ ] Documentar variables de entorno y despliegue
- [ ] Integrar QR para asistencias y confirmaciones

## Notas

- El proyecto está en desarrollo y algunos archivos de frontend aún están sin contenido.
- La base de datos SQLite se almacena localmente y se inicializa con `sequelize.sync()`.
- Se recomienda usar Node.js 18+ y una terminal compatible con rutas de Windows.
