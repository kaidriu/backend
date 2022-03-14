const { response } = require('express');
const axios = require('axios');



const db = require('../database/db')

const { Op } = require("sequelize");


const Request = db.requestI;
const RequestC = db.requestC;
const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;
const Course = db.course;
const Category = db.category;
const Subcategory = db.subcategory;
const Chapter = db.chapter;
const Topic = db.topic;

const Car = db.choppingcar;

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const CreateOrder = async (req, res = response) => {

    try {

        const { items, total } = req.body;
        const{id}=req.usuario;

        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total,
                        breakdown: {
                            item_total: { value: total, currency_code: 'USD' }
                        }
                    },
                    description: "pago de curso deunaaprende",
                    items: items
                }

            ],
            application_context: {
                brand_name: `MiTienda.com`,
                landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
                user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
                return_url: `http://localhost:8080/api/payments/capture-order/${id}`, // Url despues de realizar el pago
                cancel_url: `http://localhost:8080/api/payments/cancel-order` // Url despues de realizar el pago
            }
        }
        // format the body
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        const {
            data: { access_token },
        } = await axios.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: process.env.PAYPAL_CLIENT,
                    password: process.env.PAYPAL_SECRET,
                },
            }
        );
        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer  ${access_token}`,
                },
            }
        );

        const link = response.data.links[1].href

        res.json({ link });
        // res.json(req.body);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something goes wrong");
    }

}


const CaptureOrder = async (req, res = response) => {

    const { id } = req.params;
    const { token, PayerID } = req.query;

    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {},
        {
            auth: {
                username: process.env.PAYPAL_CLIENT,
                password: process.env.PAYPAL_SECRET,
            },
        }
    )

    await Car.destroy({
        where: {
            userId: id
        }
    });

    res.redirect("http://localhost:4200/order-completed");

}


const CancelOrder = async (req, res = response) => {


    res.redirect("http://localhost:4200");

}



const addCar = async (req, res = response) => {

    const { idc } = req.body;
    const { id } = req.usuario;
    const Carshopping = new Car({ userId: id, courseId: idc });
    await Carshopping.save();

    const course = await Course.findOne({
        where: { id: idc }
    })
    await course.update({ state_cart: true })

    res.json(Carshopping);
}


const getCar = async (req, res = response) => {

    const { id } = req.usuario;


    const Carshopping = await Car.findAll({
        where: { userId: id },
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        include: [
            {
                model: User,
                attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                include: {
                    model: Profile,
                    attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                }
            },
            {
                model: Course,
                attributes: { exclude: ['id', 'uri_folder', 'createdAt', 'updatedAt', 'objectives', 'learning', 'link_presentation', 'mode', 'state', 'subcategoryId', 'userId', 'description', 'languaje'] },
                include: {
                    model: User,
                    attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                    include: {
                        model: Profile,
                        attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    }
                }
            }
        ]
    })


    res.json({ Carshopping });
}


const deleteCar = async (req, res = response) => {

    const { idch } = req.params;
    const { id } = req.usuario;
    const Carshopping = await Car.destroy({
        where: {
            [Op.and]: [
                { userId: id },
                { courseId: idch }
            ]
        }
    });

    const course = await Course.findOne({
        where: { id: idch }
    })
    await course.update({ state_cart: false })


    res.json(Carshopping);
}


module.exports = {
    CreateOrder,
    CancelOrder,
    CaptureOrder,
    addCar,
    getCar,
    deleteCar
}