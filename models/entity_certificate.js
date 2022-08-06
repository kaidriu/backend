module.exports = (sequelize, Sequelize) => {
    const Entity_certificate = sequelize.define("entity_certificate", {
        entity_name: { 
            type: Sequelize.STRING
        },
        entity_title:{
            type: Sequelize.STRING
        },
        entity_code: {
            type: Sequelize.STRING
        }
    });
    return Entity_certificate;
};
