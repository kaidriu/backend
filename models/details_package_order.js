
module.exports = (sequelize,Sequelize) =>{
    const detail_package_order = sequelize.define("detail_package_order",{
        courses_package_id:{
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        }
    })
    return detail_package_order;
}