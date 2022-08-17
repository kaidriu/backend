module.exports = (sequelize , Sequelize) =>{
    const notification = sequelize.define("notification",{
        action: {
            type : Sequelize.STRING
        },
        viewed: {
            type : Sequelize.BOOLEAN
        },
        trash:{
            type : Sequelize.BOOLEAN
        }
    });

    return notification;
};