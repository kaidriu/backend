const { response } = require("express");
const db = require('../database/db');
const { Op } = require("sequelize");
const { Sequelize } = require('../database/db');
const Userdetails = db.userDetails;

const user = db.user;
const profile = db.profile;
const orderDetails = db.order_details;
const orders = db.order;
const payment_method = db.payment_method;
const courses = db.course;
const historypayment = db.history_payment_inst;
const commission = db.commission;

const getHistory = async (req, res = response) => {

    const { id } = req.usuario;

    const userdetails = await Userdetails.findOne({
        attributes: { exclude: ["aboutMe", "linkCurriculum", "linkYT", "linkfb", "linkTW", "createdAt", "updatedAt", "linkIG"] },
        where: { id }
    });

    res.json(userdetails);
}


const Putpaymentsinstructor = async (req, res = response) => {

    const { id } = req.usuario;
    const { bank, account_type, account_number, account_paypal, owner_name } = req.body;

    const userdetails = await Userdetails.findOne({
        attributes: { exclude: ["aboutMe", "linkCurriculum", "linkYT", "linkfb", "linkTW", "createdAt", "updatedAt", "linkIG"] },
        where: { id }
    });

    await userdetails.update({ bank, account_type, account_number, account_paypal, owner_name });


    res.json(userdetails);
}

const HistoryPayments = async (req, res = response) => {

    const { id } = req.usuario;


    const OrderDetails = await orderDetails.findAll({
        attributes: [
            'courseId',
            [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
            [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia']
            // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
        ],
        where: {
            courseId: {
                [Sequelize.Op.in]: [Sequelize.literal(`Select "id" from courses where "userId"=${id}`)]
            }
        },
        include: [
            {
                model: courses,
                attributes: {
                    exclude: ["id", "description", "objectives", "image_course", "link_presentation", "createdAt", "updatedAt", "mode", "price", "subcategoryId",
                        "state", "learning", "languaje", "uri_folder", "state_cart", "valoration", "userId", "description_large", "labels", "id_drive", "remark", "enrollmentDataInitial",
                        "enrollmentTimeInitial", "enrollmentDataFinal", "enrollmentTimeFinal", "courseDataInitial", "courseTimeInitial", "courseDataFinal",
                        "courseTimeFinal", "linkCourse", "discountCode", "percentageDiscount"]
                }

            }
        ],
        group: [Sequelize.col('order_details.courseId'), Sequelize.col('course.id')]
    });

    res.json(OrderDetails);

}

const HistoryPaymentsdetails = async (req, res = response) => {

    const { idC } = req.params;


    const startedDate = new Date("2022-04-01 00:00:00");
    const endDate = new Date("2022-04-31 00:00:00");

    const OrderDetails = await orderDetails.findAll({
        attributes: [
            'discount_order_details', 'createdAt', 'total_order_details', 'discountCode_order_details', 'discountPercentage_order_details'
        ],
        // where: {
        //     courseId: idC

        // },

        where: { 
            [Op.and]: [
                { courseId: idC }, 
                { createdAt: 
                    { [Op.between]: 
                        [startedDate, endDate] 
                    } 
                }] 
            },

        include: [
            {
                model: orders,
                where: {
                    payment_status: 'pagado'
                },
                attributes: [
                    'discount'

                ],
                include: [{
                    model: user,
                    attributes: [
                        'name', 'id', 'email'

                    ],
                    include: {
                        model: profile,
                        attributes: [
                            'image_perfil'

                        ],
                    }

                }, {
                    model: payment_method,
                    attributes: [
                        'payment_method'

                    ],
                }

                ]

            },
            {
                model: commission,
                attributes: [
                    'Percent', 'DistributionMode'
                ]
            }
        ],
        // group: [Sequelize.col('order_details.orderId'),Sequelize.col('order.id')]
    });

    const curso = await courses.findOne({
        where: { id: idC },
        attributes: [
            'price', 'title', 'image_course'

        ],
    })


    res.json({ OrderDetails, curso });

}

const GraphicHistoryPayments = async (req, res = response) => {

    const { id } = req.usuario;
    const curso = Number(req.query.curso);

    if (curso) {
        const OrderDetails = await orderDetails.findAll({
            limit: 6,
            attributes: [
                [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
                [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia'],
                [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'Mes']
                // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
            ],
            where: { courseId: curso },
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
        });

        res.json(OrderDetails);
    } else {
        const OrderDetails = await orderDetails.findAll({
            limit: 6,
            attributes: [
                [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
                [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia'],
                [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'Mes']
                // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
            ],
            where: {
                courseId: {
                    [Sequelize.Op.in]: [Sequelize.literal(`Select "id" from courses where "userId"=${id}`)]
                }

            },
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
        });

        res.json(OrderDetails);
    }



}

const getHistoryInstructor = async (req, res = response) => {

    const { id } = req.usuario;

    const history = await historypayment.findAll({
        // attributes: { exclude: [ "aboutMe", "linkCurriculum", "linkYT", "linkfb", "linkTW", "createdAt", "updatedAt", "linkIG"] },
        where: { userId: id }
    });

    res.json(history);
}

module.exports = {
    getHistory,
    Putpaymentsinstructor,
    HistoryPayments,
    GraphicHistoryPayments,
    getHistoryInstructor,
    HistoryPaymentsdetails
}