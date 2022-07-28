const { response } = require("express");
const db = require('../database/db');
const { Op } = require("sequelize");
const { Sequelize } = require('../database/db');
const orders = db.order;
const courses = db.course;
const orderDetails = db.order_details;

const HistoryPayments = async (req, res = response) => {

    const OrderDetails = await orderDetails.findAll({
        attributes: {
            exclude: [ "id", "createdAt", "orderId"]
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

}

const viewDeposit = async (req, res = response) => {

    const { payment_status } = req.params;

    const Order = await orders.findAll({
        attributes: ["id", "payment_status","file_transaction_url", "updatedAt", "total_order"],
        where:
        {
            [Op.and]: [
                { payment_status },
                {file_transaction_url: {[Op.not]: null,}},
                { paymentMethodId: 3 }
            ]
        },
        include:{
            model:orderDetails,
            attributes:["total_order_details"],
            include:{
                model:courses,
                attributes:["id","title", "image_course"],
            }
        },
        // group: [Sequelize.col('order.id'),Sequelize.col('order_detail.id')]
        // where:{userId:id}
    })


    res.json({ Order });
}

const approveDeposit = async (req, res = response) => {
    const { orderId} = req.body;
    const Order = await orders.findByPk(orderId);
    await Order.update({ payment_status:'pagado' });
    res.json({ Order });
}

const refuseDeposit = async (req, res = response) => {
    const { orderId, remark} = req.body;
    const Order = await orders.findByPk(orderId);
    await Order.update({ payment_status:'rechazado', payment_remark: remark});
    res.json({ Order });
}

module.exports = {
    HistoryPayments,
    viewDeposit,
    approveDeposit,
    refuseDeposit
}