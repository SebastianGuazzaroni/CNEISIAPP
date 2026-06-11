const express = require('express');
const cors = require('cors');
const UsuariosRouter = require('./routes/Usuarios');
const EventosRouter = require('./routes/Eventos');
const InscripcionesRouter = require('./routes/Inscripciones');
const { sequelize } = require('./models')
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use('/api/Usuarios', UsuariosRouter);
app.use('/api/Eventos', EventosRouter);
app.use('/api/Inscripciones', InscripcionesRouter);

const startServer = async () => {
  try{
    await sequelize.sync();
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
