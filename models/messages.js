module.exports = (sequelize, Sequelize) => {
    const Messajes = sequelize.define("messajes", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        // emissor_chat:
        messaje_chat: {
            type: Sequelize.TEXT
        },
        read_chat:{
            type: Sequelize.BOOLEAN
        }
    });

    return Messajes;
};