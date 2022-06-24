module.exports = (sequelize, Sequelize) => {
    const CourseReview = sequelize.define("courseReview", {
      courseStars: {
        type: Sequelize.DOUBLE
      },
      courseReview: {
        type: Sequelize.STRING
      },
    });
    return CourseReview;
  };

