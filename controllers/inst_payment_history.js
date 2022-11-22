const { response } = require("express");
const db = require("../database/db");
const { Op, where } = require("sequelize");
const { Sequelize, history_payment_inst } = require("../database/db");
const { historyOrders } = require("./Apayments");

const Userdetails = db.userDetails;

const user = db.user;
const profile = db.profile;
const orderDetails = db.order_details;
const orders = db.order;
const subcategory = db.subcategory;
const category = db.category;
const userDetails = db.userDetails;
const payment_method = db.payment_method;
const courses = db.course;
const historyPayment = db.history_payment_inst;
const commission = db.commission;
const ubication = db.Ubication;

const getHistory = async (req, res = response) => {
  const { id } = req.usuario;

  const userdetails = await Userdetails.findOne({
    attributes: {
      exclude: [
        "aboutMe",
        "linkCurriculum",
        "linkYT",
        "linkfb",
        "linkTW",
        "createdAt",
        "updatedAt",
        "linkIG",
      ],
    },
    where: { id },
    include: {
      model: profile,
      required: true,
      attributes: ["id"],
      include: [
        {
          model: ubication,
          attributes: ["country"],
        },
      ],
    },
  });

  res.json(userdetails);
};

const Putpaymentsinstructor = async (req, res = response) => {
  const { id } = req.usuario;
  const { bank, account_type, account_number, account_paypal, owner_name } =
    req.body;

  const userdetails = await Userdetails.findOne({
    attributes: {
      exclude: [
        "aboutMe",
        "linkCurriculum",
        "linkYT",
        "linkfb",
        "linkTW",
        "createdAt",
        "updatedAt",
        "linkIG",
      ],
    },
    where: { id },
  });

  await userdetails.update({
    bank,
    account_type,
    account_number,
    account_paypal,
    owner_name,
  });

  res.json(userdetails);
};

const HistoryPayments = async (req, res = response) => {
  const { id } = req.usuario;

  const OrderDetails = await orderDetails.findAll({
    attributes: [
      "courseId",
      [
        Sequelize.fn("count", Sequelize.col("order_details.courseId")),
        "Ventas",
      ],
      /* [
        Sequelize.fn("sum", Sequelize.col("order_details.total_order_details")),
        "Ganancia",
      ], */
      [
        Sequelize.literal(
          `(select SUM("order_details"."total_order_details" * ( 1 - "commissions"."Percent" )) from "order_details" inner join "orders" on "order_details"."orderId" = "orders"."id" inner join "commissions" on "order_details"."commissionId" = "commissions"."id" where "orders"."payment_status"= 'pagado' AND "order_details"."courseId"="course"."id")`
        ),
        "Ganancia",
      ],
    ],
    where: {
      courseId: {
        [Sequelize.Op.in]: [
          Sequelize.literal(`Select "id" from courses where "userId"=${id}`),
        ],
      },
    },
    include: [
      {
        model: orders,
        where: {
          payment_status: "pagado",
        },
        attributes: [],
      },
      {
        model: courses,
        attributes: ["title"] /* {
          exclude: [
            "id",
            "description",
            "objectives",
            "image_course",
            "link_presentation",
            "createdAt",
            "updatedAt",
            "mode",
            "price",
            "subcategoryId",
            "state",
            "learning",
            "languaje",
            "uri_folder",
            "state_cart",
            "valoration",
            "userId",
            "description_large",
            "labels",
            "id_drive",
            "remark",
            "enrollmentDataInitial",
            "enrollmentTimeInitial",
            "enrollmentDataFinal",
            "enrollmentTimeFinal",
            "courseDataInitial",
            "courseTimeInitial",
            "courseDataFinal",
            "courseTimeFinal",
            "linkCourse",
            "discountCode",
            "percentageDiscount",
          ],
        }, */,
      },
    ],
    group: [
      Sequelize.col("order_details.courseId"),
      Sequelize.col("course.id"),
    ],
  });

  res.json({ OrderDetails });
};

const HistoryPaymentsdetails = async (req, res = response) => {
  const { idC, valor, from, to } = req.params;

  console.log(valor);

  let OrderDetails = null;

  let estado = "por cobrar";

  if (valor == "por cobrar") estado = false;
  else estado = true;

  if ((from === "undefined") & (to === "undefined")) {
    if (valor != "todo") {
      OrderDetails = await orderDetails.findAll({
        attributes: [
          "discount_order_details",
          "createdAt",
          "total_order_details",
          "discountCode_order_details",
          "discountPercentage_order_details",
          "accredited",
        ],
        where: {
          courseId: idC,
          accredited: estado,
        },
        include: [
          {
            model: orders,
            where: { payment_status: "pagado" },
            attributes: ["discount"],
            include: [
              {
                model: user,
                attributes: ["name", "id", "email"],
                include: {
                  model: profile,
                  attributes: ["image_perfil"],
                },
              },
              {
                model: payment_method,
                attributes: ["payment_method"],
              },
            ],
          },
          {
            model: commission,
            attributes: ["Percent", "DistributionMode"],
          },
        ],
      });
    } else {
      OrderDetails = await orderDetails.findAll({
        attributes: [
          "discount_order_details",
          "createdAt",
          "total_order_details",
          "discountCode_order_details",
          "discountPercentage_order_details",
          "accredited",
        ],
        where: {
          courseId: idC,
        },
        include: [
          {
            model: orders,
            where: { payment_status: "pagado" },
            attributes: ["discount"],
            include: [
              {
                model: user,
                attributes: ["name", "id", "email"],
                include: {
                  model: profile,
                  attributes: ["image_perfil"],
                },
              },
              {
                model: payment_method,
                attributes: ["payment_method"],
              },
            ],
          },
          {
            model: commission,
            attributes: ["Percent", "DistributionMode"],
          },
        ],
      });
    }
  } else {
    if (valor != "todo") {
      OrderDetails = await orderDetails.findAll({
        attributes: [
          "discount_order_details",
          "createdAt",
          "total_order_details",
          "discountCode_order_details",
          "discountPercentage_order_details",
          "accredited",
        ],
        where: {
          [Op.and]: [
            { courseId: idC },
            { createdAt: { [Op.between]: [from, to] } },
            { accredited: estado },
          ],
        },
        include: [
          {
            model: orders,
            where: { payment_status: "pagado" },
            attributes: ["discount"],
            include: [
              {
                model: user,
                attributes: ["name", "id", "email"],
                include: {
                  model: profile,
                  attributes: ["image_perfil"],
                },
              },
              {
                model: payment_method,
                attributes: ["payment_method"],
              },
            ],
          },
          {
            model: commission,
            attributes: ["Percent", "DistributionMode"],
          },
        ],
      });
    } else {
      OrderDetails = await orderDetails.findAll({
        attributes: [
          "discount_order_details",
          "createdAt",
          "total_order_details",
          "discountCode_order_details",
          "discountPercentage_order_details",
          "accredited",
        ],
        where: {
          [Op.and]: [
            { courseId: idC },
            { createdAt: { [Op.between]: [from, to] } },
          ],
        },
        include: [
          {
            model: orders,
            where: { payment_status: "pagado" },
            attributes: ["discount"],
            include: [
              {
                model: user,
                attributes: ["name", "id", "email"],
                include: {
                  model: profile,
                  attributes: ["image_perfil"],
                },
              },
              {
                model: payment_method,
                attributes: ["payment_method"],
              },
            ],
          },
          {
            model: commission,
            attributes: ["Percent", "DistributionMode"],
          },
        ],
      });
    }
  }

  const curso = await courses.findOne({
    where: { id: idC },
    attributes: ["price", "title", "image_course"],
  });

  res.json({ OrderDetails, curso });
};

const GraphicHistoryPaymentsdetails = async (req, res = response) => {
  const { idC } = req.params;

  const fecha = new Date();
  const año = fecha.getFullYear();
  const mesActual = fecha.getMonth() + 1;

  const x = `${año}-${mesActual}-01`;
  const y = `${año}-${mesActual}-31`;

  const OrderDetails = await orderDetails.findAll({
    attributes: ["commissionId"],
    where:
      // {
      // [Op.and]: [
      { courseId: idC },
    //         {
    //             createdAt:
    //             {
    //                 [Op.between]:
    //                     [x, y]
    //             }
    //         }]
    // },

    include: [
      {
        model: orders,
        where: {
          payment_status: "pagado",
        },
        attributes: [
          // 'id'
        ],
      },
      {
        model: commission,
        attributes: [
          "DistributionMode",
          [
            Sequelize.fn("COUNT", Sequelize.col("commission.DistributionMode")),
            "amount",
          ],
        ],
      },
    ],
    group: [
      Sequelize.col("order_details.commissionId"),
      Sequelize.col("commission.id"),
    ],
  });

  res.json(OrderDetails);
};

const GraphicHistoryPayments = async (req, res = response) => {
  const { id } = req.usuario;
  const { from, to, courseId } = req.query;

  let filterCourse = {
    [Sequelize.Op.in]: [
      Sequelize.literal(`Select "id" from courses where "userId"=${id}`),
    ],
  };

  let whereBodyConditions = new Map([
    ['courseId', filterCourse]
  ]);

  let whereDateCondition = new Map();

  if (courseId) {
    let whereCondition = ['courseId',courseId];
    whereBodyConditions.set(...whereCondition);
  }

  if (from) {
    whereDateCondition.set(Sequelize.Op.gte,from)
  }

  if (to) {
    whereDateCondition.set(Sequelize.Op.lte,to)
  }

  if(whereDateCondition.size > 0){
    let whereCondition = ['createdAt', Object.fromEntries(whereDateCondition)];
    whereBodyConditions.set(...whereCondition);
  }

  whereBodyConditions = Object.fromEntries(whereBodyConditions);

  let bodyQuery = {
    attributes: [
      [
        Sequelize.fn("count", Sequelize.col("order_details.courseId")),
        "Ventas",
      ],
      [
        Sequelize.fn(
          "sum",
          Sequelize.literal(
            `"order_details"."total_order_details" * ( 1 - "commission"."Percent" )`
          )
        ),
        "Ganancia",
      ],
      [
        Sequelize.fn(
          "date_trunc",
          "month",
          Sequelize.col("order_details.createdAt")
        ),
        "Mes",
      ],
    ],
    include:[
      { 
        model: orders,
        attributes: [],
        required: true,
        where:{
          payment_status: 'pagado'
        }
      },
      {
        model: commission,
        attributes: []
      }
    ],
    group: [
      Sequelize.fn(
        "date_trunc",
        "month",
        Sequelize.col("order_details.createdAt")
      ),
    ],
    order: [
      [
        Sequelize.fn(
          "date_trunc",
          "month",
          Sequelize.col("order_details.createdAt")
        ),
        "DESC",
      ],
    ],
  }

  let promises = [];

  //NoAccredited
  whereBodyConditions.accredited = false;
  bodyQuery.where = whereBodyConditions;
  promises.push(
    orderDetails.findAll(bodyQuery)
  );

  //Accredited
  whereBodyConditions.accredited = true;
  bodyQuery.where = whereBodyConditions;
  promises.push(
    orderDetails.findAll(bodyQuery)
  );

  const [NoAccreditedSales, AccreditedSales] = await Promise.all(promises);

  res.json({ NoAccreditedSales, AccreditedSales });

};

const getHistoryInstructor = async (req, res = response) => {
  const { id } = req.usuario;

  let [historyRequest, historyPayments] = await Promise.all([
    historyPayment.findAll({
      attributes: [
        "updatedAt",
        "total_instructor_payment_history",
        "ordersDetailsIds",
      ],
      where: { userId: id, state: false },
      include: {
        model: courses,
        attributes: ["title", "image_course"],
      },
    }),
    historyPayment.findAll({
      attributes: [
        "updatedAt",
        "total_instructor_payment_history",
        "ordersDetailsIds",
      ],
      where: { userId: id, state: true },
      include: {
        model: courses,
        attributes: ["title", "image_course"],
      },
    }),
  ]);

  console.table();

  res.json({ historyRequest, historyPayments });
};

const getDetailTransfers = async (req, res = response) => {
  try {
    const { idT } = req.params;

    const history = await historyPayment.findByPk(idT);

    const resOrdersDetails = await orderDetails.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("order_details.id")), "cantidad"],
        "commissionId",
        "discountCode_order_details",
        "discountPercentage_order_details",
        "total_order_details",
      ],
      where: {
        id: {
          [Op.in]: history.dataValues.ordersDetailsIds,
        },
      },
      include: [
        {
          model: commission,
          attributes: ["Percent", "DistributionMode"],
        },
      ],
      group: [
        Sequelize.col("order_details.commissionId"),
        Sequelize.col("commission.id"),
        Sequelize.col("order_details.discountCode_order_details"),
        Sequelize.col("order_details.discountPercentage_order_details"),
        Sequelize.col("order_details.total_order_details"),
      ],
    });

    let resTable = resOrdersDetails.map(() => {});

    res.json({ resOrdersDetails, history });
  } catch (error) {
    res.json(error);
  }
};

const detailOrdersNoPaymentByCurso = async (req, res = response) => {
  const { idC } = req.params;

  const { id: idU } = req.usuario;

  let excludesOrdersDetails = await history_payment_inst.findAll({
    where: { userId: idU, state: false },
    raw: true,
    attributes: ["ordersDetailsIds"],
  });

  excludesOrdersDetails = excludesOrdersDetails.reduce((acc, value) => {
    return acc.concat(value.ordersDetailsIds);
  }, []);

  const OrderDetails = await orderDetails.findAll({
    attributes: [
      "id",
      "discount_order_details",
      "createdAt",
      "total_order_details",
      "discountCode_order_details",
      "discountPercentage_order_details",
      "accredited",
    ],
    where: {
      id: {
        [Op.notIn]: excludesOrdersDetails,
      },
      courseId: idC,
      accredited: false,
    },
    include: [
      {
        model: orders,
        where: { payment_status: "pagado" },
        attributes: ["discount"],
        include: [
          {
            model: user,
            attributes: ["name", "id", "email"],
            include: {
              model: profile,
              attributes: ["image_perfil"],
            },
          },
          {
            model: payment_method,
            attributes: ["payment_method"],
          },
        ],
      },
      {
        model: commission,
        attributes: ["Percent", "DistributionMode"],
      },
    ],
  });
  res.json({ OrderDetails });
};

const summaryCoursesNoPayment = async (req, res = response) => {
  const { id: idU } = req.usuario;

  let excludesOrdersDetails = await history_payment_inst.findAll({
    where: { userId: idU, state: false },
    raw: true,
    attributes: ["ordersDetailsIds"],
  });

  excludesOrdersDetails =
    excludesOrdersDetails.length != 0
      ? excludesOrdersDetails.reduce((acc, value) => {
          return acc.concat(value.ordersDetailsIds);
        }, [])
      : null;

  let whereOrderDetail = excludesOrdersDetails
    ? { id: { [Op.notIn]: excludesOrdersDetails }, accredited: false }
    : { accredited: false };

  let whereSumCount = excludesOrdersDetails
    ? `AND "order_details"."id" NOT IN (${excludesOrdersDetails})`
    : ``;

  console.log(excludesOrdersDetails);
  console.log(whereSumCount);

  const courseOrders = await courses.findAll({
    attributes: [
      "id",
      "title",
      "image_course",
      "price",
      [
        Sequelize.literal(
          `(select COUNT("order_details"."id") from "order_details" inner join "orders" on "order_details"."orderId" = "orders"."id" where "orders"."payment_status"= 'pagado' AND "order_details"."courseId"="course"."id" ${whereSumCount} AND "order_details"."accredited"= false)`
        ),
        "countOrdersNoPayment",
      ],
      [
        Sequelize.literal(
          `(select SUM("order_details"."total_order_details" * ( 1 - "commissions"."Percent" )) from "order_details" inner join "orders" on "order_details"."orderId" = "orders"."id" inner join "commissions" on "order_details"."commissionId" = "commissions"."id" where "orders"."payment_status"= 'pagado' AND "order_details"."courseId"="course"."id" ${whereSumCount} AND "order_details"."accredited"= false)`
        ),
        "amountOrdersNoPayment",
      ],
    ],
    where: {
      userId: idU,
    },
    include: [
      {
        model: orderDetails,
        attributes: [],
        required: true,
        where: whereOrderDetail,
        include: {
          model: orders,
          required: true,
          where: {
            payment_status: "pagado",
          },
          attributes: [],
        },
      },
    ],
    group: [Sequelize.col("course.id")],
  });

  courseOrders.map((val) => {
    val.dataValues;
  });

  res.json({ courseOrders });
};

const requestOrdersPayment = async (req, res = response) => {
  const { id } = req.usuario;

  const { ruc, business_name, courseId } = req.body;

  let { orderDetailsIds } = req.body;

  orderDetailsIds = JSON.parse(orderDetailsIds);

  let _orderDetails = await orderDetails.findAll({
    where: { id: { [Op.in]: orderDetailsIds } },
    raw: true,
    include: { model: commission },
  });

  let total_instructor_payment_history = _orderDetails.reduce(
    (value, currentValue) =>
      value +
      currentValue.total_order_details *
        (1 - currentValue["commission.Percent"]),
    0
  );

  const newInstructorPaymentHistory = new historyPayment({
    userId: id,
    ruc: ruc,
    courseId,
    business_name: business_name,
    ordersDetailsIds: orderDetailsIds,
    total_instructor_payment_history: total_instructor_payment_history,
    state: false,
  });

  await newInstructorPaymentHistory.save(),
    res.json(newInstructorPaymentHistory);
};

module.exports = {
  getHistory,
  Putpaymentsinstructor,
  HistoryPayments,
  GraphicHistoryPayments,
  getHistoryInstructor,
  HistoryPaymentsdetails,
  GraphicHistoryPaymentsdetails,
  getDetailTransfers,
  summaryCoursesNoPayment,
  detailOrdersNoPaymentByCurso,
  requestOrdersPayment,
};
