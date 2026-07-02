const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Asistencia',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      inscrito: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metodo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'manual',
      },
      eventoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'Asistencias',
      indexes: [
        {
          unique: true,
          fields: ['usuarioId', 'eventoId'],
        },
      ],
    },
  );
};
