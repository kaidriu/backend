module.exports = (sequelize, Sequelize) => {
    const Certificate = sequelize.define("certificate", {
        title_certificate: { 
            type: Sequelize.STRING
        },
        type_certificate: { 
            type: Sequelize.STRING
        },
        code_certificate: {
            type: Sequelize.STRING
        }
    });
    return Certificate;
};
