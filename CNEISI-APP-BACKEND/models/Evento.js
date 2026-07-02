const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    return sequelize.define('Evento', {
        
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        sala: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cupoMaximo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        orador: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cupoDisponible: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'GENERAL',
        },
        fechaFin: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
        {
            timestamps: false,
            tableName: 'Eventos'
        });
        
}
