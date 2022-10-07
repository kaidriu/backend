module.exports = (sequelize, Sequelize) => {
    const Discount = sequelize.define("discount", {
        
        title: { 
            type: Sequelize.STRING
        },
        
        from: {
            type: Sequelize.DATE
        },
        
        to: {
            type: Sequelize.DATE
        },
        
        percentage:{
            type: Sequelize.DOUBLE
        },
        
        state:{
            type: Sequelize.STRING
        },

        subcategoriesIds:{
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        }

    });
    return Discount;
  };
