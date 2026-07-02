const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Feedback',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      inscripcionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      respuesta1: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respuesta2: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respuesta3: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respuesta4: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respuesta5: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'Feedbacks',
      indexes: [
        {
          unique: true,
          fields: ['usuarioId', 'eventoId'],
        },
      ],
    },
  );
};
