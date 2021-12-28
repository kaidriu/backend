module.exports = (sequelize , Sequelize) =>{
    const Titles = sequelize.define("title",{
        name :{
            type : Sequelize.STRING
        },
        link : {
            type : Sequelize.STRING
        }
    });

    return Titles;
};