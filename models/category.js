module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        name_category: { 
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        }
    });
    return Category;
  };

