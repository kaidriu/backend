module.exports = (sequelize , Sequelize) =>{
    const banner = sequelize.define("banner",{
        banner_name: {
            type : Sequelize.STRING
        },
        banner_link: {
            type : Sequelize.STRING
        },
        banner_button_name: {
            type : Sequelize.STRING
        },
        banner_description: {
            type : Sequelize.STRING
        },
        banner_redirection_link: {
            type : Sequelize.STRING
        },
        banner_order: {
            type : Sequelize.INTEGER
        },
    });

    return banner;
};