module.exports = (sequelize, Sequelize) => {
    const Subcategory = sequelize.define("subcategory", {
        name_subcategory: { 
            type: Sequelize.STRING
          }
    });
    return Subcategory;
  };

