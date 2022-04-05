
const { response } = require('express');
const db = require('../database/db');
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const message = db.message;
const header_Chat = db.header_chat;
const Course = db.course;
const User = db.user;
const Profile = db.profile;
const enroll_course = db.enroll_course;



const PostMessage = async (req, res = response) => {

    const { id } = req.usuario;
    const { idt } = req.params;
    const { messaje_chat } = req.body;

    const Heade_char = await header_Chat.findOne({
        where: {
            [Op.and]: [
                { toId: id },
                { fromId: idt }
            ]
        },
    })



    if(Heade_char){

        console.log('exites');
        // const newMessage = new message({messaje_chat,userId:id,headerChatId:Heade_char.id});
        // await newMessage.save();

        // res.json(newMessage)

    }else{
        console.log('no exites');
        // const newHeader = new header_Chat({fromId:idt,toID:id});
        // await newHeader.save();

        // const newMessage = new message({messaje_chat,userId:id,headerChatId:newHeader.id});
        // await newMessage.save();

        // res.json(newMessage)

    }


}

const GetMessage = async (req, res = response) => {

    const { id } = req.usuario;
    const { idt } = req.params;

    const Heade_char = await header_Chat.findAll({
        attributes: { exclude: ['id', 'updatedAt', 'userId'] },
        // order: [['createdAt', 'ASC']],
        where: {
            // [Op.or]: [
            // {
            //     [Op.and]: [
            //         { toId: idt },
            //         { fromId: id }
            //     ]
            // }, {
            [Op.and]: [
                { toId: id },
                { fromId: idt }
            ]
            // }],
        },
        include: [
            {
                model: message,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['id', 'updatedAt', 'headerChatId'] },
                include: {
                    model: User,
                    // where:{id:toId},
                    attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                    // as:'from',
                    include: {
                        model: Profile,
                        attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    }
                }
            },



        ]

    })

    res.json(Heade_char)


}

const GetMessageEmitter = async (req, res = response) => {

    const { id } = req.usuario;
    // const { idt } = req.params;

    const Heade_char = await header_Chat.findAll({
        attributes: { exclude: ['id', 'updatedAt', 'userId'] },
        order: [['createdAt', 'ASC']],
        where: {
            toId: id
        },
        // where: {
        //     [Op.or]: [
        //         {
        //             [Op.and]: [
        //                 { toId: idt },
        //                 { fromId: id }
        //             ]
        //         }, {
        //             [Op.and]: [
        //                 { toId: id },
        //                 { fromId: idt }
        //             ]
        //         }],
        // },
        include: [
            // {
            //     model: message,
            //     attributes: { exclude: ['id', 'createdAt','updatedAt', 'headerChatId'] },             
            // },
            {
                model: User,
                // where:{id:toId},
                attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
                as: 'from',
                include: {
                    model: Profile,
                    attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                }
            }


        ]

    })

    res.json(Heade_char)


}
const SearchToChat = async (req, res = response) => {

    const { id } = req.usuario;

    let bus = req.query.busqueda;

    if (bus) {
        const [Destino] = await Promise.all([

            enroll_course.findAll({
                where: { userId: id },
                attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'enroll_date', 'status_enroll', 'enroll_finish_date', 'avg_score', 'courseId', 'userId  '] },
                // required: true,

                include: [

                    {
                        model: Course,
                        attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId', 'title', 'description', 'description_large', 'objectives', 'learning', 'image_course', 'link_presentation', 'mode', 'state', 'price', 'languaje', 'uri_folder', 'state_cart', 'valoration', 'labels', 'id_drive', 'userId'] },
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
                ]
            })

        ])

        res.json({
            Destino
        })
    } else {


        res.json({
            Destino: []
        })
    }

}

const SearchToChatInstructor = async (req, res = response) => {

    const { id } = req.usuario;

    let bus = req.query.busqueda;

    let valores = [];
    let valores2 = [];


    const x = await Course.findAll({
        attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId', 'title', 'description', 'description_large', 'objectives', 'learning', 'image_course', 'link_presentation', 'mode', 'state', 'price', 'languaje', 'uri_folder', 'state_cart', 'valoration', 'labels', 'id_drive', 'userId'] },

        where: { userId: id }
    })

    x.map((resp) => {
        valores.push(resp.id)

    })

    if (bus) {
        const [Destino] = await Promise.all([

            enroll_course.findAll({
                where: {
                    courseId: {
                        [Op.in]: valores
                    }
                },
                attributes:
                    [sequelize.fn('DISTINCT', sequelize.col('userId')), 'userId']
                ,

            })

        ])
        Destino.map((resp) => {
            valores2.push(resp.userId)
        })
        const user = await User.findAll({
            where: {

                [Op.and]: [{
                    id: {
                        [Op.in]: valores2
                    }
                }, {
                    name: {
                        [Op.iRegexp]: bus
                    }
                }]
            },
            attributes: { exclude: ['password', 'updatedAt', 'createdAt', 'is_active', 'google', 'profileId'] },
            include: {
                model: Profile,
                attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },

            }
        })
        res.json(
            user
        )


    } else {
        res.json({
            msg: []
        })
    }

}

module.exports = {
    PostMessage,
    GetMessage,
    SearchToChat,
    SearchToChatInstructor,
    GetMessageEmitter
}