module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        name_category: { 
            type: Sequelize.STRING
          }
    });
    return Category;
  };

