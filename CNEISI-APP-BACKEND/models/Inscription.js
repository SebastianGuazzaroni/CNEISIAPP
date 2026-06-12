const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {

    return sequelize.define('Inscripcion', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fechaInscripcion: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Eventos',
                key: 'id'
            }
        }
    },{
        timestamps: false,
        tableName: 'Inscripciones'
    });
}