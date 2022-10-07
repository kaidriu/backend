const dbConfig = require("./config.js");

const Sequelize = require("sequelize");

 const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: true
  },
  port: 5432,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// const sequelize = new Sequelize(process.env.DATABASE_URL);


const db = {};



//relaciones

db.Sequelize = Sequelize;
db.sequelize = sequelize;



db.user = require("../models/user.js")(sequelize, Sequelize);
db.profile = require("../models/profile.js")(sequelize, Sequelize);
db.Ubication = require("../models/Ubication")(sequelize, Sequelize);
db.UserType = require("../models/UserType")(sequelize, Sequelize);

db.title = require("../models/title")(sequelize, Sequelize);
db.userDetails = require("../models/userdetails")(sequelize, Sequelize);

db.requestI = require("../models/requestInstructor")(sequelize, Sequelize);

db.course = require("../models/course")(sequelize, Sequelize);
db.chapter = require("../models/chapter")(sequelize, Sequelize);
db.topic = require("../models/topic")(sequelize, Sequelize);
db.question_course = require("../models/question_course")(sequelize, Sequelize);
db.enroll_course = require("../models/enroll_course")(sequelize, Sequelize);

db.category = require("../models/category")(sequelize, Sequelize);
db.subcategory = require("../models/subcategory")(sequelize, Sequelize);


db.shoppingcar = require("../models/shoppingcar")(sequelize, Sequelize);
db.country = require("../models/country")(sequelize, Sequelize);
db.payment_method = require("../models/payment_metods")(sequelize, Sequelize);
db.payment_method_country = require("../models/payment_method_country")(sequelize, Sequelize);
db.order = require("../models/order")(sequelize, Sequelize);

db.order_details = require("../models/order_details")(sequelize, Sequelize);

db.quiz = require("../models/quiz")(sequelize, Sequelize);
db.question = require("../models/question")(sequelize, Sequelize);
db.option = require("../models/options")(sequelize, Sequelize);
db.task = require("../models/task")(sequelize, Sequelize);
db.favorite = require("../models/favorite")(sequelize, Sequelize);
db.content_tracking = require("../models/content_tracker")(sequelize, Sequelize);

db.archive = require("../models/archives")(sequelize, Sequelize);
db.message = require("../models/messages")(sequelize, Sequelize);
db.header_chat = require("../models/header_chat")(sequelize, Sequelize);
db.chat = require("../models/chat")(sequelize, Sequelize);

db.courseReview = require("../models/courseReview")(sequelize, Sequelize);

db.history_payment_inst = require("../models/instructor_payment_history")(sequelize, Sequelize);

db.commission = require("../models/commission")(sequelize, Sequelize);

db.packageCourse = require("../models/package_course")(sequelize, Sequelize);

db.detail_package_order = require("../models/details_package_order")(sequelize, Sequelize);

db.certificate = require("../models/certificate")(sequelize, Sequelize);

db.entity_certificate = require("../models/entity_certificate.js")(sequelize, Sequelize);

db.bank_account = require("../models/bank_accounts.js")(sequelize, Sequelize);

db.notification_type = require("../models/notification_type")(sequelize, Sequelize);

db.notification = require("../models/notification")(sequelize, Sequelize);

db.discount = require("../models/discount")(sequelize, Sequelize);


db.user.belongsTo(db.profile);
db.profile.hasOne(db.user);

db.profile.belongsTo(db.UserType);
db.UserType.hasOne(db.profile);

db.profile.belongsTo(db.Ubication);
db.Ubication.hasOne(db.profile);

db.userDetails.hasOne(db.profile);
db.profile.belongsTo(db.userDetails);

db.title.belongsTo(db.user);
db.user.hasMany(db.title);

db.requestI.belongsTo(db.profile);
db.profile.hasOne(db.requestI);

db.course.belongsTo(db.user);
db.user.hasMany(db.course);

db.chapter.belongsTo(db.course);
db.course.hasMany(db.chapter, { onDelete: 'cascade', hooks: true, });

db.topic.belongsTo(db.chapter);
db.chapter.hasMany(db.topic, { onDelete: 'cascade', hooks: true, });

db.enroll_course.belongsTo(db.course);
db.course.hasOne(db.enroll_course);

db.question_course.belongsTo(db.course);
db.course.hasMany(db.question_course, { onDelete: 'cascade', hooks: true, });


db.enroll_course.belongsTo(db.user);
db.user.hasOne(db.enroll_course);

db.subcategory.belongsTo(db.category);
db.category.hasMany(db.subcategory, { onDelete: 'cascade', hooks: true, });

db.course.belongsTo(db.subcategory);
db.subcategory.hasOne(db.course);

db.shoppingcar.belongsTo(db.user);
db.user.hasOne(db.shoppingcar);

db.shoppingcar.belongsTo(db.course);
db.course.hasOne(db.shoppingcar);

db.shoppingcar.belongsTo(db.detail_package_order);
db.detail_package_order.hasOne(db.shoppingcar);

db.detail_package_order.belongsTo(db.packageCourse);
db.packageCourse.hasOne(db.detail_package_order);

db.order_details.belongsTo(db.detail_package_order);
db.detail_package_order.hasOne(db.order_details);


db.favorite.belongsTo(db.user);
db.user.hasOne(db.favorite);

db.favorite.belongsTo(db.course);
db.course.hasOne(db.favorite);


db.payment_method_country.belongsTo(db.country);
db.country.hasOne(db.payment_method_country);

db.payment_method_country.belongsTo(db.payment_method);
db.payment_method.hasOne(db.payment_method_country);

db.order.belongsTo(db.user);
db.user.hasOne(db.order);

db.order.belongsTo(db.payment_method);
db.payment_method.hasOne(db.order);

db.order_details.belongsTo(db.order);
db.order.hasMany(db.order_details, { onDelete: 'cascade', hooks: true, });

db.order_details.belongsTo(db.course);
db.course.hasOne(db.order_details);

db.quiz.belongsTo(db.topic);
db.topic.hasOne(db.quiz, { onDelete: 'cascade', hooks: true, });

db.archive.belongsTo(db.topic);
db.topic.hasOne(db.archive, { onDelete: 'cascade', hooks: true, });

db.question.belongsTo(db.quiz);
db.quiz.hasOne(db.question, { onDelete: 'cascade', hooks: true, });

db.option.belongsTo(db.question);
db.question.hasMany(db.option, { onDelete: 'cascade', hooks: true, });

db.task.belongsTo(db.topic);
db.topic.hasOne(db.task, {onDelete: 'cascade', hooks: true,});

db.content_tracking.belongsTo(db.topic);
db.topic.hasMany(db.content_tracking,{ onDelete: 'cascade', hooks: true, });

db.content_tracking.belongsTo(db.enroll_course);
db.enroll_course.hasMany(db.content_tracking);


db.header_chat.belongsTo(db.user, { as: 'from' });
db.header_chat.belongsTo(db.user, { as: 'to' });


db.chat.belongsTo(db.user, { as: 'from' });
db.chat.belongsTo(db.user, { as: 'to' });


// db.user.hasMany(db.header_chat, { as: 'from' });  


db.message.belongsTo(db.header_chat);
db.header_chat.hasOne(db.message,{ onDelete: 'cascade', hooks: true, });

db.message.belongsTo(db.user);
db.user.hasMany(db.message);


db.history_payment_inst.belongsTo(db.user);
db.user.hasMany(db.history_payment_inst);


db.order_details.belongsTo(db.commission);
db.commission.hasOne(db.order_details);


db.courseReview.belongsTo(db.user);
db.user.hasMany(db.courseReview);

db.courseReview.belongsTo(db.course);
db.course.hasMany(db.courseReview);

db.courseReview.belongsToMany(db.courseReview, { as: 'Children', through: 'repliesCourseReview' })


//questions
db.question.belongsTo(db.archive);
db.archive.hasOne(db.question);


db.course.belongsToMany(db.packageCourse, { as: 'packageToCourse', through: 'packageCourse_course' })
db.packageCourse.belongsToMany(db.course, { as: 'packageToCourse', through: 'packageCourse_course' })

db.certificate.belongsToMany(db.entity_certificate, { as: 'certificateToEntity', through: 'throughEntityCertificate' })
db.entity_certificate.belongsToMany(db.certificate, { as: 'entityToCertificate', through: 'throughEntityCertificate' })


//certificates

// notifications
db.notification.belongsTo(db.notification_type);
db.notification.belongsTo(db.user);
db.notification.belongsTo(db.course);
db.user.hasMany(db.notification);




module.exports = db;

