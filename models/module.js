module.exports = (sequelize , Sequelize) =>{
    return sequelize.define("module",{
        name: {
            type: Sequelize.TEXT
        },
    });
};