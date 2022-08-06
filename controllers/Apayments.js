const { response } = require("express");
const db = require("../database/db");
const { Op } = require("sequelize");
const { Sequelize } = require("../database/db");
const orders = db.order;
const courses = db.course;
const orderDetails = db.order_details;
const paymentMethod = db.payment_method;
const user = db.user;
const profile = db.profile;
const commission = db.commission;
const ubication = db.Ubication;
const userDetails = db.userDetails;
const type = db.UserType;

const HistoryPayments = async (req, res = response) => {
  const OrderDetails = await orderDetails.findAll({
    attributes: {
      exclude: ["id", "createdAt", "orderId"],
    },
    /*include: [
            {
                model: orders,
                where: {
                    payment_status: 'pagado'
                },
                attributes: [],
            },
            {
                model: courses,
                attributes: {
                    exclude: ["id", "description", "objectives", "image_course", "link_presentation", "createdAt", "updatedAt", "mode", "price", "subcategoryId",
                        "state", "learning", "languaje", "uri_folder", "state_cart", "valoration", "userId", "description_large", "labels", "id_drive", "remark", "enrollmentDataInitial",
                        "enrollmentTimeInitial", "enrollmentDataFinal", "enrollmentTimeFinal", "courseDataInitial", "courseTimeInitial", "courseDataFinal",
                        "courseTimeFinal", "linkCourse", "discountCode", "percentageDiscount"]
                }

            }
        ],*/
    //group: [Sequelize.col('order_details.courseId'), Sequelize.col('course.id')]
  });

  res.json(OrderDetails);
};

const historyOrders = async (req, res = response) => {
  const _orders = await orders.findAll({
    attributes: ["id", "userId", "total_order", "updatedAt"],
    where: {
      payment_status: "pagado",
      file_transaction_url: { [Op.not]: null },
    },
    include: [
      {
        model: paymentMethod,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      {
        model: orderDetails,
        attributes: {
          exclude: [
            "id",
            "accredited",
            "createdAt",
            "updateAt",
            "orderId",
            "courseId",
            "commissionId",
          ],
        },
        include: {
          model: courses,
          attributes: ["id", "title"],
        },
      },
      {
        model: user,
        attributes: ["name", "email"],
      },
    ],
  });

  res.json(_orders);
};

const viewDeposit = async (req, res = response) => {
  const { payment_status } = req.params;

  const Order = await orders.findAll({
    attributes: [
      "id",
      "payment_status",
      "file_transaction_url",
      "updatedAt",
      "total_order",
    ],
    where: {
      [Op.and]: [
        { payment_status },
        { file_transaction_url: { [Op.not]: null } },
        { paymentMethodId: 3 },
      ],
    },
    include: {
      model: orderDetails,
      attributes: ["total_order_details"],
      include: {
        model: courses,
        attributes: ["id", "title", "image_course"],
      },
    },
    // group: [Sequelize.col('order.id'),Sequelize.col('order_detail.id')]
    // where:{userId:id}
  });

  res.json({ Order });
};

const approveDeposit = async (req, res = response) => {
  const { orderId } = req.body;
  const Order = await orders.findByPk(orderId);
  await Order.update({ payment_status: "pagado" });
  res.json({ Order });
};

const refuseDeposit = async (req, res = response) => {
  const { orderId, remark } = req.body;
  const Order = await orders.findByPk(orderId);
  await Order.update({ payment_status: "rechazado", payment_remark: remark });
  res.json({ Order });
};

//Commissions
const getCommissions = async (req, res = response) => {
  const Commissions = await commission.findAll();
  res.json({ Commissions });
};

const putCommissions = async (req, res = response) => {
  try {
    const { id, title, percent } = req.body;
    const Commissions = await commission.findByPk(id);
    await Commissions.update({ DistributionMode: title, Percent: percent });
    res.json({ Commissions });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const historialCommissionsGraphic = async (req, res = response) => {
  const summaryCommissions = await orderDetails.findAll({
    attributes: [
      "commissionId",
      [Sequelize.fn("COUNT", Sequelize.col("order.id")), "compras"],
      [
        Sequelize.fn("SUM", Sequelize.col("order_details.total_order_details")),
        "ventas",
      ],
    ],
    include: [
      {
        model: orders,
        required: true,
        where: {
          payment_status: "pagado",
        },
        attributes: [],
      },
      {
        model: commission,
        attributes: ["DistributionMode", "Percent"],
      },
    ],
    group: [
      Sequelize.col("order_details.commissionId"),
      Sequelize.col("commission.id"),
    ],
  });
  res.json({ summaryCommissions });
};

const summaryCoursesNoPayment = async (req, res = response) => {
  const { idU } = req.params;

  const CoursesUser = await courses.findAll({
    attributes: [
      [Sequelize.fn("array_agg", Sequelize.col("course.id")), "course.id"],
    ],
    where: {
      userId: idU,
    },
  });

  res.json({ CoursesUser });
};

const summaryNoPaymentInstructor = async (req, res = response) => {
    let instructores = await profile.findAll({
        attributes:[
            "id",
            "image_perfil",
            "phone"
        ],
        include:[
            {
                model: user,
                attributes:[
                    "id",
                    "name",
                    "email",
					          [Sequelize.literal('(select COUNT("courses"."id") from "courses" where "courses"."userId" = "user"."id")'), 'totalCourses']

                ],
            },
            {
                model: ubication,
                attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            },
            {
                model: userDetails,
                attributes: [
                  "account_type",
                ],
            },
            {
                model: type,
                required: true,
                where: {
                    nametype: 'instructor'
                },
                attributes: [],
            },
        ],
    });

    let arrPromise = [];
  
    instructores.map((instructor)=>{
      let userId = instructor.dataValues.user.dataValues.id;
      arrPromise.push(
        new Promise((resolve, reject) => {
          try {
            orderDetails.findOne({
              attributes: [
                  [Sequelize.fn('SUM', Sequelize.col('order_details.total_order_details')), 'amount']
                ],
              raw: true,
              where:{
                  accredited: false
              },
              include: [
                {
                  model: courses,
                  attributes: [],
                  required: true,
                  where: {
                    userId: userId
                  },
                },
                {
                  model: orders,
                  attributes: [],
                  required: true,
                  where: {
                    payment_status: "pagado",
                  },
                },
              ],
            }).then((orders)=>{
              instructor.dataValues.amount = orders.amount || 0;
              resolve();
            });  
          } catch (error) {
            reject();
          }
          
        })
      );
    });

    await Promise.all(arrPromise);

  res.json({ instructores });
};

module.exports = {
  HistoryPayments,
  viewDeposit,
  approveDeposit,
  refuseDeposit,
  historyOrders,
  getCommissions,
  putCommissions,
  historialCommissionsGraphic,
  summaryCoursesNoPayment,
  summaryNoPaymentInstructor,
};
