module.exports = (sequelize, Sequelize) => {
    const Header_chat = sequelize.define("header_chat", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        }
    });

    return Header_chat;
};