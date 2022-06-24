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
const instructor_payment_history = db.instructor_payment_history;


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
        ],
        group: [Sequelize.col('order_details.courseId'), Sequelize.col('course.id')]
    });

    res.json(OrderDetails);

}

const HistoryPaymentsdetails = async (req, res = response) => {

    const { idC, valor, from, to } = req.params;

    console.log("mira ---- >");
    console.log(valor);

    let OrderDetails = null;
    let estado = 'por cobrar'

    if (valor == 'por cobrar')
        estado = false;
    else
        estado = true;

    console.log("variables ------>");
    console.log(estado);

    if (from === 'undefined' & to === 'undefined') {
        if (valor != 'todo') {
            /* const fecha = new Date();
            const año = fecha.getFullYear();
            const mesActual = fecha.getMonth() + 1;
    
            const x = `${año}-${mesActual}-01`;
            const y = `${año}-${mesActual}-31`; */

            OrderDetails = await orderDetails.findAll({
                attributes: [
                    'discount_order_details', 'createdAt', 'total_order_details', 'discountCode_order_details',
                    'discountPercentage_order_details', 'accredited'
                ],
                where: {
                    courseId: idC,
                    accredited: estado
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
        } else {
            OrderDetails = await orderDetails.findAll({
                attributes: [
                    'discount_order_details', 'createdAt', 'total_order_details', 'discountCode_order_details',
                    'discountPercentage_order_details', 'accredited'
                ],
                where: {
                    courseId: idC,
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
        }
    } else {
        if (valor != 'todo') {
            OrderDetails = await orderDetails.findAll({
                attributes: [
                    'discount_order_details', 'createdAt', 'total_order_details', 'discountCode_order_details',
                    'discountPercentage_order_details', 'accredited'
                ],
                where: {
                    [Op.and]: [
                        { courseId: idC },
                        { createdAt: { [Op.between]: [from, to] } },
                        { accredited: estado }
                    ]
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
        } else {
            OrderDetails = await orderDetails.findAll({
                attributes: [
                    'discount_order_details', 'createdAt', 'total_order_details', 'discountCode_order_details',
                    'discountPercentage_order_details', 'accredited'
                ],
                where: {
                    [Op.and]: [
                        { courseId: idC },
                        { createdAt: { [Op.between]: [from, to] } },
                    ]
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
        }
    }

    const curso = await courses.findOne({
        where: { id: idC },
        attributes: [
            'price', 'title', 'image_course'
        ],
    });

    res.json({ OrderDetails, curso });
}

const GraphicHistoryPaymentsdetails = async (req, res = response) => {

    const { idC } = req.params;

    const fecha = new Date();
    const año = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;

    const x = `${año}-${mesActual}-01`;
    const y = `${año}-${mesActual}-31`;

    const OrderDetails = await orderDetails.findAll({
        attributes: [
            'commissionId'

        ],
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
                    payment_status: 'pagado'
                },
                attributes: [
                    // 'id'
                ],
            },
            {
                model: commission,
                attributes: [
                    'DistributionMode',
                    [Sequelize.fn('COUNT', Sequelize.col('commission.DistributionMode')), 'amount']
                ]
            }
        ],
        group: [Sequelize.col('order_details.commissionId'), Sequelize.col('commission.id')]
    });

    res.json(OrderDetails);


}

const GraphicHistoryPayments = async (req, res = response) => {

    const { id } = req.usuario;
    const { from, to, idC } = req.params;
    // const curso = Number(req.query.curso);
    // const from = req.query.from;
    // const until = req.query.until;

    console.log('--------------------------');
    // console.log(from);
    // console.log(to);
    console.log(id);
    console.log(idC);


    if (idC === 'undefined') {

        const NoAccreditedSales = await orderDetails.findAll({
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
                },
                accredited: false
            },
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
        });

        const AccreditedSales = await orderDetails.findAll({
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
                },
                accredited: true
            },
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
            order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
        });

        res.json({ NoAccreditedSales, AccreditedSales });


    } else {

        if (idC === 'null') {
            console.log('--------nulo-------');
            const NoAccreditedSales = await orderDetails.findAll({
                limit: 6,
                attributes: [
                    [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
                    [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia'],
                    [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'Mes']
                    // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
                ],
                where: {
                    [Op.and]: [
                        {
                            courseId: {
                                [Sequelize.Op.in]: [Sequelize.literal(`Select "id" from courses where "userId"=${id}`)]
                            }
                        },
                        {
                            createdAt:
                            {
                                [Op.between]:
                                    [from, to]
                            }
                        },
                        { accredited: false }
                    ]

                },
                group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
                order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
            });

            const AccreditedSales = await orderDetails.findAll({
                limit: 6,
                attributes: [
                    [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
                    [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia'],
                    [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'Mes']
                    // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
                ],
                where: {
                    [Op.and]: [
                        {
                            courseId: {
                                [Sequelize.Op.in]: [Sequelize.literal(`Select "id" from courses where "userId"=${id}`)]
                            }
                        },
                        {
                            createdAt:
                            {
                                [Op.between]:
                                    [from, to]
                            }
                        },
                        { accredited: true }
                    ]

                },
                group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
                order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
            });

            res.json({ NoAccreditedSales, AccreditedSales });

        } else {
            const NoAccreditedSales = await orderDetails.findAll({
                attributes: [
                    [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
                    [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia'],
                    [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'Mes']
                    // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
                ],
                where: {
                    [Op.and]: [
                        { courseId: idC },
                        {
                            createdAt:
                            {
                                [Op.between]:
                                    [from, to]
                            }
                        },
                        { accredited: false }
                    ]

                },
                group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
                order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
            });

            const AccreditedSales = await orderDetails.findAll({
                attributes: [
                    [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
                    [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia'],
                    [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'Mes']
                    // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
                ],
                where: {
                    [Op.and]: [
                        { courseId: idC },
                        {
                            createdAt:
                            {
                                [Op.between]:
                                    [from, to]
                            }
                        },
                        { accredited: true }
                    ]

                },
                group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt'))],
                order: [[Sequelize.fn('date_trunc', 'month', Sequelize.col('order_details.createdAt')), 'DESC']],
            });

            res.json({ NoAccreditedSales, AccreditedSales });

        }


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

const getDetailTransfers = async (req, res = response) => {

    try {
        const { idT } = req.params;
        console.log(idT);

        const history = await historypayment.findByPk(idT);

        const resOrdersDetails = await orderDetails.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('order_details.id')), 'cantidad'],
                'commissionId',
                'discountCode_order_details',
                'discountPercentage_order_details',
                'total_order_details',
            ],
            where: {
                id: {
                    [Op.in]: history.dataValues.ordersDetailsIds
                }
            },
            include: [{
                model: commission,
                attributes: ['Percent', 'DistributionMode']
            }],
            group: [Sequelize.col('order_details.commissionId'), Sequelize.col('commission.id'), Sequelize.col('order_details.discountCode_order_details'), Sequelize.col('order_details.discountPercentage_order_details'), Sequelize.col('order_details.total_order_details')]
        });

        let resTable = resOrdersDetails.map(() => {

        });


        res.json({resOrdersDetails, history});
    } catch (error) {
        res.json(error);
    }

}

module.exports = {
    getHistory,
    Putpaymentsinstructor,
    HistoryPayments,
    GraphicHistoryPayments,
    getHistoryInstructor,
    HistoryPaymentsdetails,
    GraphicHistoryPaymentsdetails,
    getDetailTransfers
}