
module.exports = (sequelize,Sequelize) =>{
    const package_course = sequelize.define("package_course",{
        cant_course:{
            type:Sequelize.INTEGER
        },
        price_package : {
            type:Sequelize.DOUBLE
        },
        percents_package:{
            type:Sequelize.DOUBLE
        }
    })
    return package_course;
}