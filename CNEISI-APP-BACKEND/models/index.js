const path = require('path');
const { Sequelize } = require('sequelize');

const sqliteStorage = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.resolve(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: sqliteStorage,
  logging: false,
});

const Usuario = require('./Usuario')(sequelize);
const Evento = require('./Evento')(sequelize);
const Inscripcion = require('./Inscripcion')(sequelize);
const Whitelist = require('./Whitelist')(sequelize);
const Asistencia = require('./Asistencia')(sequelize);
const Feedback = require('./Feedback')(sequelize);

Usuario.hasMany(Inscripcion, { foreignKey: 'usuarioId', as: 'inscripciones' });
Inscripcion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Evento.hasMany(Inscripcion, { foreignKey: 'eventoId', as: 'inscripciones' });
Inscripcion.belongsTo(Evento, { foreignKey: 'eventoId', as: 'evento' });

Usuario.hasMany(Asistencia, { foreignKey: 'usuarioId', as: 'asistencias' });
Asistencia.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Evento.hasMany(Asistencia, { foreignKey: 'eventoId', as: 'asistencias' });
Asistencia.belongsTo(Evento, { foreignKey: 'eventoId', as: 'evento' });

Usuario.hasMany(Feedback, { foreignKey: 'usuarioId', as: 'feedbacks' });
Feedback.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Evento.hasMany(Feedback, { foreignKey: 'eventoId', as: 'feedbacks' });
Feedback.belongsTo(Evento, { foreignKey: 'eventoId', as: 'evento' });

Inscripcion.hasMany(Feedback, { foreignKey: 'inscripcionId', as: 'feedbacks' });
Feedback.belongsTo(Inscripcion, { foreignKey: 'inscripcionId', as: 'inscripcion' });

module.exports = {
  sequelize,
  Usuario,
  Evento,
  Inscripcion,
  Whitelist,
  Asistencia,
  Feedback,
};
