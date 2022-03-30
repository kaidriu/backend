
const { response } = require('express');
const db = require('../database/db');
const { Op } = require("sequelize");

const message = db.message;
const Course = db.course;
const User = db.user;
const Profile = db.profile;
const enroll_course = db.enroll_course;



const PostMessage = async (req, res = response) => {

}

const GetMessage = async (req, res = response) => {

}


const SearchToChat = async (req, res = response) => {

    const { id } = req.usuario;

    let bus = req.query.busqueda;

    // bus = bus.map((item) => {
    //     return {$iLike: item};
    // });
    // const regex = new RegExp(bus);


    // const usuario = await User.findAll({
    //     where: {
    //         name: {
    //             [Op.iRegexp]: bus
    //         }
    //     },


    // });

    // const desde = Number(req.query.desde) || 0;


    if (bus) {
        const [ Destino] = await Promise.all([

            enroll_course.findAll({
                where: { userId: id },
                attributes: { exclude: ['id','userId','createdAt', 'updatedAt','enroll_date','status_enroll','enroll_finish_date','avg_score','courseId','userId  '] },
                // required: true,

                include: [

                    {
                        model: Course,
                        attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId','title','description','description_large','objectives','learning','image_course','link_presentation','mode','state','price','languaje','uri_folder','state_cart','valoration','labels','id_drive','userId'] },
                        required: true,
                        include: {
                            model: User,
                            attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                            where: {
                                name: {
                                    [Op.iRegexp]: bus
                                }
                            },
                            include: {
                                model: Profile,
                                attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                            }
                        }
                    },

                    // {
                    //     model: User,
                    //     where: {
                    //         name: {
                    //             [Op.iRegexp]: bus
                    //         }
                    //     },
                    //     attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                    //     include: {
                    //         model: Profile,
                    //         attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    //     }
                    // },
                ]
            })

            // Profile.findAll({
            //     offset: desde, limit: 5,
            //     order: [['id', 'ASC']],
            //     attributes: { exclude: ['created    At', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
            //     include: [
            //         {
            //             model: User,
            //             where: {
            //                 name: {
            //                     [Op.iRegexp]: bus
            //                 }
            //             },
            //             attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
            //         },
            //         {
            //             model: Ubication,
            //             attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            //         },
            //         {
            //             model: UserDetails,
            //             attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            //         },
            //         {
            //             model: Type,
            //             where: {
            //                 nametype: 'usuario'
            //             },
            //             attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            //         }
            //     ],


            // }),

            // Profile.count({
            //     include: [
            //         {
            //             model: Type,
            //             where: {
            //                 nametype: 'usuario'
            //             },
            //         },
            //         {
            //             model: User,
            //             where: {
            //                 name: {
            //                     [Op.iRegexp]: bus
            //                 }
            //             },
            //         }
            //     ],

            // })

        ])

        res.json({
            Destino
        })
    } else {


        res.json({
            Destino:[]
        })
        // const [usuarios, total] = await Promise.all([

        //     Profile.findAll({
        //         offset: desde, limit: 5,
        //         order: [['id', 'ASC']],
        //         attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
        //         include: [
        //             {
        //                 model: User,
        //                 attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
        //             },
        //             {
        //                 model: Ubication,
        //                 attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        //             },
        //             {
        //                 model: UserDetails,
        //                 attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        //             },
        //             {
        //                 model: Type,
        //                 where: {
        //                     nametype: 'usuario'
        //                 },
        //                 attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        //             }
        //         ],

        //     }),

        //     Profile.count({
        //         include: [
        //             {
        //                 model: Type,
        //                 where: {
        //                     nametype: 'usuario'
        //                 },
        //             },
        //             {
        //                 model: User,
        //             }
        //         ],

        //     })

        // ])

        // res.json({
        //     usuarios, total
        // })
    }

}

const   SearchToChatInstructor = async (req, res = response) => {

    const { id } = req.usuario;

    let bus = req.query.busqueda;

    // bus = bus.map((item) => {
    //     return {$iLike: item};
    // });
    // const regex = new RegExp(bus);


    // const usuario = await User.findAll({
    //     where: {
    //         name: {
    //             [Op.iRegexp]: bus
    //         }
    //     },


    // });

    // const desde = Number(req.query.desde) || 0;  


    if (bus) {
        const [ Destino] = await Promise.all([

            enroll_course.findAll({
                where: { userId: id },
                attributes: { exclude: ['id','userId','createdAt', 'updatedAt','enroll_date','status_enroll','enroll_finish_date','avg_score','courseId','userId  '] },
                // required: true,

                include: [

                    {
                        model: Course,
                        attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId','title','description','description_large','objectives','learning','image_course','link_presentation','mode','state','price','languaje','uri_folder','state_cart','valoration','labels','id_drive','userId'] },
                        required: true,
                        include: {
                            model: User,
                            attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                            where: {
                                name: {
                                    [Op.iRegexp]: bus
                                }
                            },
                            include: {
                                model: Profile,
                                attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                            }
                        }
                    },

                    // {
                    //     model: User,
                    //     where: {
                    //         name: {
                    //             [Op.iRegexp]: bus
                    //         }
                    //     },
                    //     attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                    //     include: {
                    //         model: Profile,
                    //         attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    //     }
                    // },
                ]
            })

            // Profile.findAll({
            //     offset: desde, limit: 5,
            //     order: [['id', 'ASC']],
            //     attributes: { exclude: ['created    At', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
            //     include: [
            //         {
            //             model: User,
            //             where: {
            //                 name: {
            //                     [Op.iRegexp]: bus
            //                 }
            //             },
            //             attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
            //         },
            //         {
            //             model: Ubication,
            //             attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            //         },
            //         {
            //             model: UserDetails,
            //             attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            //         },
            //         {
            //             model: Type,
            //             where: {
            //                 nametype: 'usuario'
            //             },
            //             attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            //         }
            //     ],


            // }),

            // Profile.count({
            //     include: [
            //         {
            //             model: Type,
            //             where: {
            //                 nametype: 'usuario'
            //             },
            //         },
            //         {
            //             model: User,
            //             where: {
            //                 name: {
            //                     [Op.iRegexp]: bus
            //                 }
            //             },
            //         }
            //     ],

            // })

        ])

        res.json({
            Destino
        })
    } else {


        res.json({
            Destino:[]
        })
        // const [usuarios, total] = await Promise.all([

        //     Profile.findAll({
        //         offset: desde, limit: 5,
        //         order: [['id', 'ASC']],
        //         attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
        //         include: [
        //             {
        //                 model: User,
        //                 attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
        //             },
        //             {
        //                 model: Ubication,
        //                 attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        //             },
        //             {
        //                 model: UserDetails,
        //                 attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        //             },
        //             {
        //                 model: Type,
        //                 where: {
        //                     nametype: 'usuario'
        //                 },
        //                 attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        //             }
        //         ],

        //     }),

        //     Profile.count({
        //         include: [
        //             {
        //                 model: Type,
        //                 where: {
        //                     nametype: 'usuario'
        //                 },
        //             },
        //             {
        //                 model: User,
        //             }
        //         ],

        //     })

        // ])

        // res.json({
        //     usuarios, total
        // })
    }

}

module.exports = {
    PostMessage,
    GetMessage,
    SearchToChat,
    SearchToChatInstructor
}