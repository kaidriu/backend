module.exports = (sequelize , Sequelize) =>{
    const notificationType = sequelize.define("notification_type",{
        title: {
            type : Sequelize.STRING
        },
        icon: {
            type : Sequelize.STRING
        },

    });

    return notificationType;
};