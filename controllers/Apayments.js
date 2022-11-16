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
const payment_method = db.payment_method;
const subcategory = db.subcategory;
const category = db.category;
const instructorPaymentHistory = db.history_payment_inst
const enroll_course = db.enroll_course;
const detail_package = db.detail_package_order;
const detailPackageOrders = db.detail_package_order;
const packageCourse = db.packageCourse;
const bankAccount = db.bank_account;


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
/**
 * Revisar si se cuenta el valor de los cursos dentro de paquetes
 * 
 */
const historyOrders = async (req, res = response) => {
  
  const _orders = await orders.findAll({
    attributes: ["id", "userId", "total_order", "updatedAt"],
    where: {
      payment_status: "pagado",
      paymentMethodId: { [Op.not]: null },
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
        include: [
          {
            model: courses,
            attributes: ["id", "title"],
          },
		    ],
      },
      {
        model: user,
        attributes: ["name", "email"],
      },
    ],
    order: [["id", "DESC"]],
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

  console.log(Order);

  res.json({ Order });
};

const approveDeposit = async (req, res = response) => {
  const { orderId } = req.body;
  const Order = await orders.findByPk(orderId);
  let f = new Date(); //Obtienes la fecha
  let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
  const Order_details = await orderDetails.findAll({
    attributes: ["id", "courseId"],
    include: [{
      model: orders,
      attributes: ["id"],
      where: { id: orderId }
    },
    {
      model: detail_package,
      attributes: ["id", "courses_package_id"],
    }
    ]
  })



  Order_details.map(async (resp) => {


    if (resp.detail_package_order) {
      resp.detail_package_order.courses_package_id.map(async (resp2) => {
        const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp2, userId: Order.userId })
        await Enroll_course.save();
      })

    } else {
      const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp.courseId, userId: Order.userId })
      await Enroll_course.save();
    }


  })

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
    res.status(400).send(error);
  }
};

const historialCommissionsGraphic = async (req, res = response) => {
  const summaryCommissions = await orderDetails.findAll({
    attributes: [
      "commissionId",
      [Sequelize.fn("COUNT", Sequelize.col("order.id")), "compras"],
      [Sequelize.fn("SUM", Sequelize.col("order_details.total_order_details")), "ventas"],
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
        required: true,
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

  const courseOrders = await courses.findAll({
    attributes: [
      "id",
      "title",
      "image_course",
      "price",
      [Sequelize.literal(`(select COUNT("order_details"."id") from "order_details" inner join "orders" on "order_details"."orderId" = "orders"."id" where "orders"."payment_status"= 'pagado' AND "order_details"."courseId"="course"."id" AND "order_details"."accredited"= false)`), 'countOrdersNoPayment'],
      [Sequelize.literal(`(select SUM("order_details"."total_order_details") from "order_details" inner join "orders" on "order_details"."orderId" = "orders"."id" where "orders"."payment_status"= 'pagado' AND "order_details"."courseId"="course"."id" AND "order_details"."accredited"= false)`), 'amountOrdersNoPayment'],
      //[Sequelize.literal('(select COUNT("enroll_courses"."id") from "enroll_courses" where "enroll_courses"."courseId"="course"."id")'), 'countStudents'],
    ],
    where: {
      userId: idU,
    },
    include: [{
      model: orderDetails,
      attributes: [],
      required: true,
      where: {
        accredited: false
      },
      include: {
        model: orders,
        required: true,
        where: {
          payment_status: "pagado",
        },
        attributes: [],
      }
    },
    {
      model: subcategory,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: category,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
    ],
    group: [Sequelize.col("course.id"), Sequelize.col("subcategory.id"), Sequelize.col("subcategory->category.id")]
  });

  const infoPayments = await userDetails.findOne({
    attributes: ['id', 'bank', 'account_type', 'account_number', 'account_paypal', 'owner_name'],
    include: {
      model: profile,
      required: true,
      attributes: [],
      include: {
        model: user,
        attributes: [],
        where: {
          id: idU
        }
      }
    }
  });


  res.json({ courseOrders, infoPayments });
};

const summaryNoPaymentInstructor = async (req, res = response) => {
  let instructores = await profile.findAll({
    attributes: [
      "id",
      "image_perfil",
      "phone",
      [Sequelize.literal('(select COUNT("courses"."id") from "courses" where "courses"."userId" = "user"."id")'), 'totalCourses'],
      [Sequelize.literal(`(SELECT SUM("order_details"."total_order_details") FROM "order_details" INNER JOIN "courses" ON "order_details"."courseId" = "courses"."id" AND "courses"."userId" = "user"."id" INNER JOIN "orders" ON "order_details"."orderId" = "orders"."id" AND "orders"."payment_status" = 'pagado' WHERE "order_details"."accredited" = false)`), 'amount'],
    ],
    include: [
      {
        model: user,
        attributes: [
          "id",
          "name",
          "email"
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
    order: [[Sequelize.col("amount"), 'DESC NULLS LAST']]
  });

  res.json({ instructores });
};

const detailOrdersNoPaymentByCurso = async (req, res = response) => {
  const { idC } = req.params;

	const OrderDetails = await orderDetails.findAll({
		attributes: [
			'id','discount_order_details', 'createdAt', 'total_order_details', 'discountCode_order_details',
			'discountPercentage_order_details', 'accredited'
		],
		where: {
			courseId: idC,
			accredited: false
		},
		include: [
			{
				model: orders,
				where: { payment_status: 'pagado' },
				attributes: ['discount'],
				include: [
					{
						model: user,
						attributes: ['name', 'id', 'email'],
						include: {
							model: profile,
							attributes: ['image_perfil'],
						}
					},
					{
						model: payment_method,
						attributes: ['payment_method'],
					}
				]
			},
			{
				model: commission,
				attributes: ['Percent', 'DistributionMode']
			}
		],
	});
	res.json({OrderDetails})
};

const getHistoryPaymentsInstructor = async (req, res = response) => {

  const { idU } = req.params;

  const history = await instructorPaymentHistory.findAll({
      // attributes: { exclude: [ "aboutMe", "linkCurriculum", "linkYT", "linkfb", "linkTW", "createdAt", "updatedAt", "linkIG"] },
      where: { userId: idU }
  });

  res.json({history});
}

const payInstructor = async (req, res = response) => {
  
  const { userId, payment_method, entity, count_payment, total_instructor_payment_history} = req.body;

	let { orderDetailsIds } = req.body;
  	
	if(typeof(orderDetailsIds)!=='object')
		orderDetailsIds = [orderDetailsIds];

	orderDetailsIds.map((str)=>{
		str = parseInt(str);;
	});

	const _instructorPaymentHistory = new instructorPaymentHistory({
		userId,
		payment_method,
		entity,
		count_payment,
		ordersDetailsIds: orderDetailsIds,
		total_instructor_payment_history
	});

  await Promise.all([
	_instructorPaymentHistory.save(),
	orderDetails.update(
		{accredited: true},
		{where: {
			id: {
				[Op.in]: orderDetailsIds,
			  },
		}})
  ]);

  res.json(_instructorPaymentHistory);

}

const getBankAccounts = async (req, res = response) => {
  const bank_accounts = await bankAccount.findAll();
  res.json({bank_accounts}) 
}

const postBankAccount = async (req, res = response) => {
  const {title, bank, type, number, owner_name, owner_document } = req.body;
  
  const newBankAccount = new bankAccount({title, bank, type, number, owner_name, owner_document})
  await newBankAccount.save();
  res.json({bankAccounts: newBankAccount});
}

const putBankAccount = async (req, res = response) => {
  try {
    const {id, title, bank, type, number, owner_name, owner_document } = req.body;
  
    const updateBankAccount = await bankAccount.findByPk(id);

    if(!updateBankAccount){
      throw new Error('No existe la cuenta')
    }

    await updateBankAccount.update({title, bank, type, number, owner_name, owner_document});

    res.json({bankAccount: updateBankAccount});
  } catch (error) {
    res.status(404).json(error.message);
  }
  
}

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
  detailOrdersNoPaymentByCurso,
  payInstructor,
  getHistoryPaymentsInstructor,
  getBankAccounts,
  postBankAccount,
  putBankAccount
};
