module.exports = (sequelize , Sequelize) =>{
    return sequelize.define("admin",{
        access: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        }
    });
};