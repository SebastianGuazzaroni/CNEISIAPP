const express = require('express');
const cors = require('cors');
const UsuariosRouter = require('./routes/Usuarios');
const EventosRouter = require('./routes/Eventos');
const InscripcionesRouter = require('./routes/Inscripciones');
const { sequelize } = require('./models')
const { Sequelize } = require('sequelize')
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use('/api/Usuarios', UsuariosRouter);
app.use('/api/Eventos', EventosRouter);
app.use('/api/Inscripciones', InscripcionesRouter);
const AuthRouter = require('./routes/Authentications')
app.use('/api/Authentications', AuthRouter);

const startServer = async () => {
  try{
    await sequelize.sync();

    // Ensure 'rol' column exists in Usuarios table (safe on repeated runs)
    try {
      const qi = sequelize.getQueryInterface();
      const tableInfo = await qi.describeTable('Usuarios')
      if (!tableInfo.rol) {
        await qi.addColumn('Usuarios', 'rol', { type: Sequelize.STRING, allowNull: true, defaultValue: 'participant' })
        console.log('Added column Usuarios.rol')
      }

      if (!tableInfo.legajo) {
        await qi.addColumn('Usuarios', 'legajo', { type: Sequelize.STRING, allowNull: true })
        console.log('Added column Usuarios.legajo')
      }
    } catch (err) {
      console.warn('Could not ensure Usuarios.rol column:', err.message || err)
    }
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

if(require.main === module) {
  startServer();
}

module.exports = app;
