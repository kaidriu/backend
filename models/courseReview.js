module.exports = (sequelize, Sequelize) => {
    const CourseReview = sequelize.define("courseReview", {
      courseStars: {
        type: Sequelize.DOUBLE
      },
      courseReview: {
        type: Sequelize.STRING
      },
      isReported:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isBan:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    });
    return CourseReview;
  };

