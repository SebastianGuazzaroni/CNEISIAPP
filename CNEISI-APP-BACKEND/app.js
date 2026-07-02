const express = require('express');
const cors = require('cors');
const UsuariosRouter = require('./routes/Usuarios');
const EventosRouter = require('./routes/Eventos');
const InscripcionesRouter = require('./routes/Inscripciones');
const WhitelistRouter = require('./routes/Whitelist');
const AsistenciasRouter = require('./routes/Asistencias');
const AuthRouter = require('./routes/Authentications');
const { sequelize } = require('./models');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = 3000;

// Configuración básica de Express
app.use(cors());
app.use(express.json());

// Rutas de API organizadas por recurso
app.use('/api/Usuarios', UsuariosRouter);
app.use('/api/Eventos', EventosRouter);
app.use('/api/Inscripciones', InscripcionesRouter);
app.use('/api/Whitelist', WhitelistRouter);
app.use('/api/Asistencias', AsistenciasRouter);
app.use('/api/Authentications', AuthRouter);

const startServer = async () => {
  try {
    await sequelize.sync();

    try {
      const qi = sequelize.getQueryInterface();
      const tableInfo = await qi.describeTable('Usuarios');
      if (!tableInfo.rol) {
        // Si la columna rol no existe, la agregamos para garantizar compatibilidad
        // con versiones anteriores de la base de datos.
        await qi.addColumn('Usuarios', 'rol', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'participant',
        });
        console.log('Added column Usuarios.rol');
      }
    } catch (err) {
      console.warn('Could not ensure Usuarios.rol column:', err.message || err);
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
