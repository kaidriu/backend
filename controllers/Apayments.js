const { response } = require("express");
const db = require('../database/db');
const { Op } = require("sequelize");
const { Sequelize } = require('../database/db');
const orders = db.order;
const courses = db.course;
const orderDetails = db.order_details;



/*const HistoryPayments = async (req, res = response) => {

    const OrderDetails = await orderDetails.findAll({
        attributes: [
            'courseId',
            [Sequelize.fn('count', Sequelize.col('order_details.courseId')), 'Ventas'],
            [Sequelize.fn('sum', Sequelize.col('order_details.total_order_details')), 'Ganancia']
            // exclude: [ "id", "discount_order_details", "total_order_details", "createdAt", "updatedAt", "orderId"] 
        ],
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

}*/

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

module.exports = {
    HistoryPayments
}