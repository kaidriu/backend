module.exports = (sequelize, Sequelize) => {
    const Chapter = sequelize.define("chapter", {
        number_chapter: { 
            type: Sequelize.INTEGER
          },
      
        title_chapter: { 
        type: Sequelize.STRING
      }
    });
    return Chapter;
  };

