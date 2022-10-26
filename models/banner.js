module.exports = (sequelize , Sequelize) =>{
    const banner = sequelize.define("banner",{
        banner_name: {
            type : Sequelize.STRING
        },
        banner_link: {
            type : Sequelize.STRING
        }
    });

    return banner;
};