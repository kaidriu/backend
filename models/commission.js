

module.exports=(sequelize,Sequelize)=>{

    const Commission = sequelize.define('commission',{

        DistributionMode:{
            type:Sequelize.STRING
        },
        Percent:{
            type:Sequelize.DOUBLE
        },
        status:{
            type: Sequelize.BOOLEAN
        }
    });
    return Commission;

}