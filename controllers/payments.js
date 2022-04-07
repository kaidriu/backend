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

const order = db.order;
const order_details = db.order_details;
const enroll_course = db.enroll_course;

const Car = db.choppingcar;
const Favorite = db.favorite;

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const CreateOrder = async (req, res = response) => {

    try {


        var f = new Date(); //Obtienes la fecha
    

        let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
       
        console.log(fecha);
    
    
        const { formData ,total_order , items  }= req.body;
    
        const {buyer_name, buyer_address, buyer_email, buyer_phone, discount, file_transaction_url, buyer_countre, buyer_state, buyer_postcode} = formData;
    
        const {id}= req.usuario;
    
        const payment_status = 'pendiente';
    
        const Order = new order({userId:id,buyer_name, buyer_address, buyer_email, buyer_phone, payment_status, discount, file_transaction_url, total_order, buyer_countre, buyer_state, buyer_postcode });
    
        await Order.save();

        items.map(async (resp)=>{
    
            const Order_Details = new order_details({ total_order_details : resp.unit_amount.value , orderId : Order.id, courseId : resp.courseId})
    
            await Order_Details.save();
    
    
            const Enroll_course = new enroll_course({ enroll_date : fecha, status_enroll : 'empezar', courseId : resp.courseId ,userId : id})
            await Enroll_course .save();
        })
    
    
    
        // res.json({Order});  



        const orders = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total_order,
                        breakdown: {
                            item_total: { value: total_order, currency_code: 'USD' }
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
                return_url: `http://localhost:8080/api/payments/capture-order/${id}/${Order.id}`, // Url despues de realizar el pago
                cancel_url: `http://localhost:8080/api/payments/cancel-order/${Order.id}` // Url despues de realizar el pago
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
        orders,
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

    const { id , ido } = req.params;
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
    
    console.log(ido);

    const Order = await order.findOne({
        where:{id:ido}
    })
    console.log(Order);
    await Order.update({payment_status:'pagado'})


    // res.redirect("http://localhost:4200/order-completed");
    res.redirect("https://de-una-aprende.herokuapp.com/order-completed");

}


const CancelOrder = async (req, res = response) => {

    const { ido } = req.params;

    const Order = await order.findOne({
        where:{id:ido}
    })
    
    await Order.destroy();

    // res.redirect("http://localhost:4200");
    res.redirect("https://de-una-aprende.herokuapp.com");

}


const SaveOrder = async (req, res = response) => {

    var f = new Date(); //Obtienes la fecha
    

    let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
   
    console.log(fecha);


    const {curso, formData ,total_order }= req.body;

    const {buyer_name, buyer_address, buyer_email, buyer_phone, discount, file_transaction_url, buyer_countre, buyer_state, buyer_postcode} = formData;

    const {id}= req.usuario;

    const payment_status = 'pagado';

    const Order = new order({userId:id,buyer_name, buyer_address, buyer_email, buyer_phone, payment_status, discount, file_transaction_url, total_order, buyer_countre, buyer_state, buyer_postcode });

    await Order.save();

    console.log('------------------------');    
    // console.log(buyer_name);
    // console.log(req.body);

    curso.map(async (resp)=>{

        const Order_Details = new order_details({ total_order_details : resp.unit_amount.value , orderId : Order.id, courseId : resp.courseId})

        await Order_Details.save();


        const Enroll_course = new enroll_course({ enroll_date : fecha, status_enroll : 'empezar', courseId : resp.courseId ,userId : id})
        await Enroll_course .save();
    })



    res.json({Order});  
}



const addCar = async (req, res = response) => {

    const { idc } = req.body;
    const { id } = req.usuario;

    const busqueda = await Car.findOne({
        where:{

            [Op.and]:[{
                userId:id
            },{
                courseId:idc
            }]
            
        
        }
    })

    if(busqueda){
        console.log('yyyyyyyyyy');
        res.json({msg:"ya existe"})

    }else{

        console.log('xxxxxxxxxxxxx');
        const Carshopping = new Car({ userId: id, courseId: idc });
        await Carshopping.save();
    
        // const course = await Course.findOne({
        //     where: { id: idc }
        // })       
        // await course.update({ state_cart: true })
    
        res.json(Carshopping);
    }

   
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

const addFav = async (req, res = response) => {

    const { idc } = req.body;
    const { id } = req.usuario;
    const favorites = new Favorite({ userId: id, courseId: idc });
    await favorites.save();

    // const course = await Course.findOne({
    //     where: { id: idc }
    // })
    // await course.update({ state_cart: true })

    res.json(favorites);

}

const getFav = async (req, res = response) => {
    const { id } = req.usuario;


    const favorites = await Favorite.findAll({
        where: { userId: id },
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        include: [
            // {
            //     model: User,
            //     attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
            //     include: {
            //         model: Profile,
            //         attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
            //     }
            // },
            {
                model: Course,
                attributes: { exclude: ['id', 'uri_folder', 'createdAt', 'updatedAt', 'objectives', 'learning', 'link_presentation', 'state', 'subcategoryId', 'userId', 'description', 'languaje'] },
                include: [{
                    model: User,
                    attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                    // include: {
                    //     model: Profile,
                    //     attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    // }
                },
                {
                    model:Subcategory,
                    include:{
                        model: Category
                    }
                }
            ]
            }
        ]   
    })


    res.json({ favorites });
}


const deleteFav = async (req, res = response) => {
    const { idch } = req.params;
    const { id } = req.usuario;
    console.log(idch);
    console.log(id);
    const favorite = await Favorite.destroy({
        where: {
            [Op.and]: [
                { userId: id },
                { courseId: idch }
            ]
        }
    });

    res.json(favorite);
}


const deleteallcar = async (req,res=response)=>{

    const { id} = req.usuario;

    await Car.destroy({
        where: {
            userId: id
        }
    });

    res.json({
        msg:'Eliminado'
    })
}


module.exports = {
    CreateOrder,
    CancelOrder,
    CaptureOrder,
    addCar,
    getCar,
    deleteCar,
    addFav,
    getFav,
    deleteFav,
    SaveOrder,
    deleteallcar
}