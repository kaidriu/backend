module.exports = (sequelize, Sequelize) => {
    const chat = sequelize.define("chat", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        message: {
            type: Sequelize.TEXT
        },
    });

    return chat;
};