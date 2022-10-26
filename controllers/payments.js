const { response } = require('express');
const axios = require('axios');



const db = require('../database/db')

const { Op } = require("sequelize");
const { uploadFilePayOrder, generatePublicUrl } = require('../helpers/drive');


const User = db.user;
const Profile = db.profile;
const Course = db.course;
const Category = db.category;
const Subcategory = db.subcategory;
const order = db.order;
const order_details = db.order_details;
const enroll_course = db.enroll_course;
const Car = db.shoppingcar;
const Favorite = db.favorite;
const package = db.packageCourse;
const detail_package = db.detail_package_order;
const bankAccount = db.bank_account;
const paymentMethod = db.payment_method;

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const CreateOrder = async (req, res = response) => {

    try {


        const { formData, total_order, items } = req.body;

        const { buyer_name, buyer_address, buyer_email, buyer_phone, discount, file_transaction_url, buyer_countre, buyer_state, buyer_postcode } = formData;

        const { id } = req.usuario;

        const payment_status = 'cancelado';

        console.log(items)

        const Order = new order({ userId: id, buyer_name, buyer_address, buyer_email, buyer_phone, payment_status, discount, file_transaction_url, total_order, buyer_countre, buyer_state, buyer_postcode ,paymentMethodId:1});

        await Order.save();

        items.map(async (resp) => {

            if (resp.pack.courses) {

                const Order_Details = new order_details({ total_order_details: resp.pack.price, orderId: Order.id, detailPackageOrderId: resp.pack.id })
                await Order_Details.save();

            } else {
                const Order_Details = new order_details({ total_order_details: resp.unit_amount.value, orderId: Order.id, courseId: resp.courseId })


                await Order_Details.save();
            }



        })



        // res.json({Order});  



        let x = [];
        let descrip = `Paquetes de cursos:
        ` ;

        items.map(async (resp) => {
            if (resp.pack.courses) {

                resp.pack.courses.map((resp2) => {
                    descrip = descrip.concat(`
               ◾ ${resp2.title}`);
                })
                x.push({
                    name: `Paquete de ${resp.pack.packSize} cursos`,
                    unit_amount: { currency_code: resp.unit_amount.currency_code, value: resp.pack.price },
                    quantity: '1',
                    description: descrip
                })
            } else {
                x.push({
                    name: resp.name,
                    unit_amount: { currency_code: resp.unit_amount.currency_code, value: resp.unit_amount.value },
                    quantity: '1',
                })
            }
        })


        console.log(x)
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
                    items: x
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

    const { id, ido } = req.params;
    const { token, PayerID } = req.query;



    let f = new Date();
    let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {},
        {
            auth: {
                username: process.env.PAYPAL_CLIENT,
                password: process.env.PAYPAL_SECRET,
            },
        }
    )

    const Order_details = await order_details.findAll({
        attributes: ["id", "courseId"],
        include: [{
            model: order,
            attributes: ["id"],
            where: { id: ido }
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
                const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp2, userId: id })
                await Enroll_course.save();
            })

        } else {
            const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp.courseId, userId: id })
            await Enroll_course.save();
        }


    })

    await Car.destroy({
        where: {
            userId: id
        }
    });



    const Order = await order.findOne({
        where: { id: ido }
    })
    console.log(Order);
    await Order.update({ payment_status: 'pagado' })




    res.redirect("https://cursos-production.up.railway.app/order-completed");
    // res.redirect("https://de-una-aprende.herokuapp.com/order-completed");

}


const CancelOrder = async (req, res = response) => {

    const { ido } = req.params;

    const Order = await order.findOne({
        where: { id: ido }
    })

    await Order.destroy();

    // res.redirect("http://localhost:4200");
    res.redirect("https://cursos-production.up.railway.app");

}


const SaveOrder = async (req, res = response) => {


    var f = new Date(); //Obtienes la fecha


    let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

    console.log(fecha);


    const { curso, formData, total_order } = req.body;

    const { buyer_name, buyer_address, buyer_email, buyer_phone, discount, file_transaction_url, buyer_countre, buyer_state, buyer_postcode } = formData;

    const { id } = req.usuario;

    const payment_status = 'pagado';

    const Order = new order({ userId: id, buyer_name, buyer_address, buyer_email, buyer_phone, payment_status, discount, file_transaction_url, total_order, buyer_countre, buyer_state, buyer_postcode ,paymentMethodId:2});

    await Order.save();


    console.log('------------------------');

    let x = [];

    console.log(curso)

    // console.log(buyer_name);
    // console.log(req.body);


    curso.map(async (resp) => {

        if (resp.pack.courses) {

            const Order_Details = new order_details({ total_order_details: resp.pack.price, orderId: Order.id, detailPackageOrderId: resp.pack.id })
            await Order_Details.save();

            resp.pack.courses.map(async (resp2) => {
                // console.log(resp2);
                console.log(resp2.id);
                const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp2.id, userId: id })
                await Enroll_course.save();
            })

        } else {
            const Order_Details = new order_details({ total_order_details: resp.unit_amount.value, orderId: Order.id, courseId: resp.courseId })


            await Order_Details.save();

            const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp.courseId, userId: id })
            await Enroll_course.save();
        }


        // const Order_Details = new order_details({ total_order_details: resp.unit_amount.value, orderId: Order.id, courseId: resp.courseId })

        // await Order_Details.save();


        // const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp.courseId, userId: id })
        // await Enroll_course.save();
    })







    res.json({ Order });
}



const payDeposit = async (req, res = response) => {

    var f = new Date(); //Obtienes la fecha


    let fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

    console.log(fecha);


    const { curso, formData, total_order, paymentMethodId } = req.body;

    const { buyer_name, buyer_address, buyer_email, buyer_phone, discount, file_transaction_url, buyer_countre, buyer_state, buyer_postcode } = formData;

    const { id } = req.usuario;

    const payment_status = 'pendiente';

    const Order = new order({ userId: id, buyer_name, buyer_address, buyer_email, buyer_phone, payment_status, discount, file_transaction_url, total_order, buyer_countre, buyer_state, buyer_postcode, paymentMethodId });

    await Order.save();


    console.log('------------------------');
    // console.log(buyer_name);
    // console.log(req.body);

    // curso.map(async (resp) => {


        // const Order_Details = new order_details({ total_order_details: resp.unit_amount.value, orderId: Order.id, courseId: resp.courseId })

        // await Order_Details.save();


        // const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp.courseId, userId: id })
        // await Enroll_course.save();
    // })

    
    curso.map(async (resp) => {

        if (resp.pack.courses) {

            const Order_Details = new order_details({ total_order_details: resp.pack.price, orderId: Order.id, detailPackageOrderId: resp.pack.id })
            await Order_Details.save();

            // resp.pack.courses.map(async (resp2) => {
            //     // console.log(resp2);
            //     console.log(resp2.id);
            //     const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp2.id, userId: id })
            //     await Enroll_course.save();
            // })

        } else {
            const Order_Details = new order_details({ total_order_details: resp.unit_amount.value, orderId: Order.id, courseId: resp.courseId })


            await Order_Details.save();

            // const Enroll_course = new enroll_course({ enroll_date: fecha, status_enroll: 'empezar', courseId: resp.courseId, userId: id })
            // await Enroll_course.save();
        }



    })


    await Car.destroy({
        where: {
            userId: id
        }
    });

    res.json({ Order });
}


const viewDeposit = async (req, res = response) => {

    const { id } = req.usuario;
    const Order = await order.findAll({
        attributes: ["id", "payment_status", "file_transaction_url", "createdAt", "total_order"],
        where:
        {
            [Op.and]: [
                { userId: id },
                { paymentMethodId: 3 }
            ]
        },
        // include:{
        //     model:order_details,
        //     attributes:["total_order_details","createdAt"],
        //     include:{
        //         model:Course,
        //         attributes:["title"],
        //     }
        // }
        // where:{userId:id}
    })


    res.json({ Order });
}

const viewFactura = async (req, res = response) => {

    const { id } = req.usuario;
    const Order = await order.findAll({
        attributes: ["id", "payment_status", "file_transaction_url", "createdAt", "total_order"],
        where:
        {
            [Op.and]: [
                { userId: id },
                { payment_status: 'pagado' }
            ]
        },
        include:[{
            model:order_details,
            attributes:["total_order_details","createdAt"],
            include:[{
                model:Course,
                attributes:["title"],
            }]
        },
        {
            model:paymentMethod
        }
    ]
        // where:{userId:id}
    })


    res.json({ Order });
}

const putDeposit = async (req, res = response) => {


    const { id } = req.params;
    const { archivo } = req.files;
    const { tempFilePath } = archivo;


    const Order = await order.findOne({
        where:
            { id },
    })

    uploadFilePayOrder(tempFilePath, archivo.name, archivo.mimetype).then((resp) => {
        generatePublicUrl(resp).then(async (fileURLs) => {
            await Order.update({ file_transaction_url: fileURLs.webContentLink })
            res.json(Order);
        })
    })

}




const addCar = async (req, res = response) => {

    const { idc } = req.body;
    const { id } = req.usuario;

    const busqueda = await Car.findOne({
        where: {

            [Op.and]: [{
                userId: id
            }, {
                courseId: idc
            }]


        }
    })

    if (busqueda) {
        console.log('yyyyyyyyyy');
        res.json({ msg: "ya existe" })

    } else {

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
            },
            {
                model: detail_package,
                attributes: ['id', 'courses_package_id'],
                // attributes:['id', 
                // [
                //     sequelize.literal(
                //       '(SELECT title from courses where "id" in courses_package_id)'
                //     ),
                //     "tasks",
                //   ]
                // ],
                include: {
                    model: package,
                    attributes: ['id', 'cant_course', 'price_package'],
                }
            }
        ]
    })


    let cursos = [];
    let carShopping = [];
    Carshopping.map((resp, index) => {
        if (resp.detail_package_order) {
            cursos.push({
                "pos": index,
                "cursosIds": resp.detail_package_order.courses_package_id
            })
        }
    })

    console.log('🎈🎈🎈');
    console.log(cursos);


    for (let index = 0; index < cursos.length; index++) {
        const { cursosIds, pos } = cursos[index];

        let courses = await Course.findAll({
            where: {
                id: {
                    [Op.in]: cursosIds,
                },
            },
            attributes: { exclude: ['uri_folder', 'createdAt', 'updatedAt', 'objectives', 'learning', 'link_presentation', 'mode', 'state', 'subcategoryId', 'userId', 'description', 'languaje'] },
            include: {
                model: User,
                attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                include: {
                    model: Profile,
                    attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                }
            }
        });
        console.log('🎈');
        Carshopping[pos].detail_package_order.courses_package_id = courses;
        //   Carshopping.detail_package_order[pos].prueba=courses;



    }


    res.json({ Carshopping });
}


const deleteCar = async (req, res = response) => {

    const { idch } = req.params;
    const { id } = req.usuario;

    const Carshopping = await Car.destroy({
        where: {
            // [Op.and]: [
            //     { userId: id },
            //     { courseId: idch }
            // ]
            id: idch
        }
    });

    // const course = await Course.findOne({
    //     where: { id: idch }
    // })
    // await course.update({ state_cart: false })


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
                    model: Subcategory,
                    include: {
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

const deleteFavoriteInArray = async (req, res = response) => {
    let { ids } = req.params;
    const { id } = req.usuario;
    console.log(ids);
    console.log(id);

    ids = ids.split(",");
    console.log(ids)
    const favorite = await Favorite.destroy({
        where: {
            [Op.and]: [
                { userId: id },
                {
                    courseId: {
                        [Op.in]:
                            ids
                    }

                }
                // { courseId: idch }   
            ]
        }
    });

    res.json(favorite);
}





const deleteallcar = async (req, res = response) => {

    const { id } = req.usuario;

    await Car.destroy({
        where: {
            userId: id
        }
    });

    res.json({
        msg: 'Eliminado'
    })
}


const getPackage = async (req, res = response) => {

    const packageCourse = await package.findAll();
    res.json(packageCourse);

}

const getCoursesInPackage = async (req, res = response) => {
    const { id } = req.params;
    const packageCourse = await package.findOne({
        where: {
            id
        },
        include: {
            model: Course, as: 'CourseToPackage',
            attributes: ["title", "description", "image_course", "id", "updatedAt"],
            include:
                [
                    {
                        model: User,
                        attributes: {
                            exclude: [
                                "id",
                                "password",
                                "updatedAt",
                                "createdAt",
                                "email",
                                "is_active",
                                "google",
                                "profileId",
                            ],
                        },
                        include: {
                            model: Profile,
                            attributes: {
                                exclude: [
                                    "id",
                                    "updatedAt",
                                    "createdAt",
                                    "userTypeId",
                                    "ubicationId",
                                    "userDetailId",
                                    "education",
                                    "phone",
                                    "aboutMe",
                                    "profession",
                                    "gender",
                                    "edad",
                                ],
                            },
                        },
                    },
                    {
                        model: Subcategory,
                        attributes: {
                            exclude: ["updatedAt", "createdAt", "categoryId", "name_subcategory"],
                        },
                        include: {
                            model: Category,
                            attributes: { exclude: ["id", "updatedAt", "createdAt"] },
                        },
                    },
                ]
            // {
            //     model:User,
            //     attributes:["name"]
            // }
        }
    });
    res.json({ packageCourse });

}


const buyPackage = async (req, res = response) => {
    const { courses_package_id, packageCourseId } = req.body;
    const { id } = req.usuario;
    console.log(courses_package_id);
    const details_package = new detail_package({ courses_package_id, packageCourseId })
    await details_package.save();

    const Carshopping = new Car({ userId: id, detailPackageOrderId: details_package.id });
    await Carshopping.save();

    res.json(details_package);

}

const getBankAccounts = async (req, res = response) => {
    const bank_accounts = await bankAccount.findAll();
    res.json({bank_accounts}) 
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
    deleteallcar,
    payDeposit,
    viewDeposit,
    putDeposit,
    deleteFavoriteInArray,
    getPackage,
    getCoursesInPackage,
    buyPackage,
    getBankAccounts,
    viewFactura
}