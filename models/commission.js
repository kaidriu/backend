

module.exports=(sequelize,Sequelize)=>{

    const Commission = sequelize.define('commission',{

        DistributionMode:{
            type:Sequelize.STRING
        },
        Percent:{
            type:Sequelize.DOUBLE
        },

    });
    return Commission;

}