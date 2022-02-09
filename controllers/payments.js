const { response } = require('express');
const axios = require('axios');


const db = require('../database/db')

const { Op, where } = require("sequelize");


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

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const CreateOrder = async (req, res = response) => {

    try {

        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "100.00",
                        breakdown: {
                            item_total: {value: '100.00', currency_code: 'USD'}
                        }
                    }, 
                    description: "pago de curso deunaaprende",
                    items:[
                        {
                            name:'teclado',
                            description : 'fuerte',
                            unit_amount: {
                                currency_code: "USD",
                                value: "50.00"
                            },
                            quantity: "1"
                        },
                        {
                            name:'teclado',
                            description : 'fuerte',
                            unit_amount: {
                                currency_code: "USD",
                                value: "50.00"
                            },
                            quantity: "1"
                        }
                    ]
                }
               
            ],
            application_context: {
                brand_name: `MiTienda.com`,
                landing_page: 'NO_PREFERENCE', // Default, para mas informacion https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
                user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
                return_url: `http://localhost:8080/api/payments/capture-order`, // Url despues de realizar el pago
                cancel_url: `http://localhost:3000/cancel-payment` // Url despues de realizar el pago
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

        console.log(access_token);


        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer A21AAJ2bRtdmksrD6flg0DQJgi8s5qiR1exD7IHK3YrVc0Zu4NFEy4hnPo5n3Tra6As6j7rh6iXFBDT6C6P5e_PZBXyBZ8jXA`,
                },
            }
        );



        res.json(response.data);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something goes wrong");
    }

}


const CaptureOrder = async (req, res = response) => {


    const { token, PayerID } = req.query;

    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {},
        {
            auth: {
                username: process.env.PAYPAL_CLIENT,
                password: process.env.PAYPAL_SECRET,
            },
        }
    )

    console.log(response);
    res.json(msg = 'hola');
        
}


const CancelOrder = async (req, res = response) => {


    res.json(msg = 'hola');

}

module.exports = {
    CreateOrder,
    CancelOrder,
    CaptureOrder
}