
const { response } = require('express');
const db = require('../database/db');
const { Op } = require("sequelize");




const message = db.message;
const header_Chat = db.header_chat;
const Course = db.course;
const User = db.user;
const Profile = db.profile;
const enroll_course = db.enroll_course;
const chat = db.chat;

const sequelize = require("sequelize");

//////////SOCKETS 

const grabarMensaje = async( message,fromId,toId  ) => {

    /*
        payload: {
            de: '',
            para: '',
            texto: ''
        }
    */

    try {
        const mensaje = new chat( {message,fromId,toId } );
        await mensaje.save();

        return true;
    } catch (error) {
        return false;
    }

}


const obtenerChat = async(req, res) => {

    const { id } = req.usuario;
    const { idt } = req.params;

    const chat30 = await chat.findAll({
        // $or: [{ de: miId, para: mensajesDe }, { de: mensajesDe, para: miId } ]
         order: [['createdAt', 'ASC']],
        limit:30,
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { toId: idt },
                        { fromId: id }
                    ]
                }, {
                    [Op.and]: [
                        { toId: id },
                        { fromId: idt }
                    ]
                }],
        },
        include: {
            model: User,
            // where:{id:toId},
            attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
            as:'from',
            include: {
                model: Profile,
                attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
            }
        }

    })
    // .sort({ createdAt: 'desc' })
    // .limit(30);

    res.json( chat30 )

}

const ultimomensaje = async(req, res) => {

    const { id } = req.usuario;
    // const { idt } = req.params;

    const Chat = await chat.findAll({
        // $or: [{ de: miId, para: mensajesDe }, { de: mensajesDe, para: miId } ]
         order: [['createdAt', 'ASC']],
        // limit:30,
        where: {
            [Op.or]: [
                { toId: id },
                // [Op.not]: {toId: id},
                // {[Op.not]: {fromId: id}}
                { fromId: id }
            ]
        },
        // include: [
        //     {
        //         model: User,
        //         // where:{id:toId},
        //         attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
        //         as:'from',
        //         include: {
        //             model: Profile,
        //             attributes: ["image_perfil"] ,
        //         }
        //     },
        //     {
        //         model: User,
        //         // where:{id:toId},
        //         attributes: { exclude: ['id', 'password', 'updatedAt', 'createdAt', 'email', 'is_active', 'google', 'profileId'] },
        //         as:'to',
        //         include: {
        //             model: Profile,
        //             attributes: ["image_perfil"] ,
        //         }
        //     },
        // ]

    })

    let ultimoMensaje = [];

    // Chat.map(async (resp) => {


    //     // let Message = await message.findOne({
    //     //     where: { headerChatId: resp.id },
    //     //     order: [['createdAt', 'DESC']],
    //     //     // limit:1
    //     //     include: {
    //     //         model: User
    //     //     }
    //     // })
    //     // console.log(Message.userId);
    //     // console.log(Message.messaje_chat);
    //     // Message.map((resp2)=>{
    //     // console.log(resp);
    //     // console.log(Message);


    //     if (resp.fromId != id) {

    //         ultimoMensaje.push({
    //             "id": resp.id,
    //             "createdAt": resp.createdAt,
    //             "emisor": resp.fromId,
    //             // "toId": resp.toId,
    //             "Mensaje": resp.message,
    //             "from": {
    //                 "name": resp.from.name,
    //                 "profile": {
    //                     "image_perfil": resp.from.profile.image_perfil
    //                 }
    //             }
    //         })

    //         // ultimoMensaje.push({
    //         //     "fromId": resp.fromId,

    //         // })


    //     } else {

    //         ultimoMensaje.push({
    //             "id": resp.id,
    //             "createdAt": resp.createdAt,
    //             // "fromId": resp.fromId,
    //             "emisor": resp.toId,
    //             "Mensaje": resp.message,
    //             "from": {
    //                 "name": resp.to.name,
    //                 "profile": {
    //                     "image_perfil": resp.to.profile.image_perfil
    //                 }
    //             }
    //         })

    //         // ultimoMensaje.push({

    //         //     "toId": resp.toId
    //         // })


    //     }





    //     // Heade_char.push({"Mensaje":Message.messaje_chat})
    //     // })



    //     if (Chat.length == ultimoMensaje.length) {
    //         // console.log(ultimoMensaje);
    //         res.json(

    //             ultimoMensaje
    //         )
    //     }






    //     // ultimoMensaje.push(resp.fromId);
    //     // ultimoMensaje.push(resp.toId);
    //     // ultimoMensaje2.push(resp.id);
    // })
    // .sort({ createdAt: 'desc' })
    // .limit(30);

    res.json(Chat)
}



/////////////Antiguos
const PostMessage = async (messages,fromId,toId ) => {

    // const { id } = req.usuario;
    // const { idt } = req.params;
    // const { messaje_chat } = req.body;

    const Heade_char = await header_Chat.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { toId: fromId },
                        { fromId: toId }
                    ]
                }, {
                    [Op.and]: [
                        { toId: toId },
                        { fromId: fromId }
                    ]
                }],
        },
    })


    if (Heade_char) {
        console.log('exites');
        const newMessage = new message({ messaje_chat: messages, userId: fromId, headerChatId: Heade_char.id });
        await newMessage.save();

        return true;

    } else {
        console.log('no exites');
        const newHeader = new header_Chat({ fromId: fromId, toId: toId });
        await newHeader.save();

        const newMessage = new message({ messaje_chat: messages, userId: fromId, headerChatId: newHeader.id });
        await newMessage.save();

        return true;

    }


}

const GetMessage = async (req, res = response) => {

    const { id } = req.usuario;
    const { idt } = req.params;

    const Heade_char = await header_Chat.findOne({
        attributes: { exclude: ['updatedAt', 'userId'] },
        // order: [['createdAt', 'ASC']],
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { toId: idt },
                        { fromId: id }
                    ]
                }, {
                    [Op.and]: [
                        { toId: id },
                        { fromId: idt }
                    ]
                }],
        },


    })

    if (Heade_char) {
        const Mensaje = await message.findAll({
            where: {
                headerChatId: Heade_char.id
            },
            order: [['createdAt', 'ASC']],
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

        })
        res.json(Mensaje)
    } else {
        res.json()
    }



}

const GetMessageEmitter = async (req, res = response) => {

    const { id } = req.usuario;

    const Heade_char = await header_Chat.findAll({
        // attributes: { exclude: ['updatedAt', 'read_chat'] },

        where: {
            [Op.or]: [
                { toId: id },
                // [Op.not]: {toId: id},
                // {[Op.not]: {fromId: id}}
                { fromId: id }
            ]
        },
        include:
            [
                {
                    model: User,        
                    as: 'to',
                    include: {
                        model: Profile,
                        attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    }
                },
                {
                    model: User,
                    as: 'from',
                    include: {
                        model: Profile,
                        attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
                    }
                }
            ]
        // order: [['createdAt', 'DESC']],
    })
    let ultimoMensaje = [];
    if(Heade_char.length>0){
        Heade_char.map(async (resp) => {


            let Message = await message.findOne({
                where: { headerChatId: resp.id },
                order: [['createdAt', 'DESC']],
                // limit:1
                include: {
                    model: User
                }
            })
    
    
            if (resp.fromId != id) {
    
                ultimoMensaje.push({
                    "id": resp.id,
                    "createdAt": Message.createdAt,
                    "emisor": resp.fromId,
                    // "toId": resp.toId,
                    "Mensaje": Message.messaje_chat,
                    "from": {
                        "name": resp.from.name,
                        "email": resp.from.email,
                        "profile": {
                            "image_perfil": resp.from.profile.image_perfil
                        }
                    }
                })
    
    
    
            } else {
    
                ultimoMensaje.push({
                    "id": resp.id,
                    "createdAt": Message.createdAt,
                    // "fromId": resp.fromId,
                    "emisor": resp.toId,
                    "Mensaje": Message.messaje_chat,
                    "from": {
                        "name": resp.to.name,
                        "email": resp.to.email,
                        "profile": {
                            "image_perfil": resp.to.profile.image_perfil
                        }
                    }
                })
    
    
            }
    
            if (Heade_char.length == ultimoMensaje.length) {
                res.json(
    
                    ultimoMensaje
                )
            }
    
        })
    }else{
        res.json(Heade_char)
    }

}



const SearchToChat = async (req, res = response) => {

    const { id } = req.usuario;

    let bus = req.query.busqueda;
    let valores = [];
    let valores2 = [];
    // let Destino =[];

    if(bus){
        const Enroll_course = await enroll_course.findAll({
            where: { userId: id },
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt', 'enroll_date', 'status_enroll', 'enroll_finish_date', 'avg_score', 'userId  '] },
    
        });
        Enroll_course.map((resp) => {
            console.log(resp);
            valores.push(resp.courseId)
    
        })
    
        const course = await Course.findAll({
            where: {
                id: {
                    [Op.in]: valores
                }
            },
            attributes:
                [sequelize.fn('DISTINCT', sequelize.col('userId')), 'userId']
            ,
    
        })
    
        course.map((resp) => {
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
    }else{
        res.json(
                    Destino
                )
    }



    // if (bus) {
    //     const [Destino] = await Promise.all([

    //         enroll_course.findAll({
    //             where: { userId: id },
    //             attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt', 'enroll_date', 'status_enroll', 'enroll_finish_date', 'avg_score', 'courseId', 'userId  '] },
    //             // required: true,

    //             include: [

    //                 {
    //                     model: Course,
    //                     attributes: { exclude: ['updatedAt', 'createdAt', 'subcategoryId', 'title', 'description', 'description_large', 'objectives', 'learning', 'image_course', 'link_presentation', 'mode', 'state', 'price', 'languaje', 'uri_folder', 'state_cart', 'valoration', 'labels', 'id_drive', 'userId'] },
    //                     required: true,
    //                     include: {
    //                         model: User,
    //                         attributes: { 
    //                             exclude: ['password', 'updatedAt', 'createdAt', 'is_active', 'google', 'profileId'] 
    //                         },
    //                         where: {
    //                             name: {
    //                                 [Op.iRegexp]: bus
    //                             }
    //                         },
    //                         include: {
    //                             model: Profile,
    //                             attributes: { exclude: ['id', 'updatedAt', 'createdAt', 'userTypeId', 'ubicationId', 'userDetailId', 'education', 'phone', 'aboutMe', 'profession', 'gender', 'edad'] },
    //                         }
    //                     }
    //                 },
    //             ]
    //         })

    //     ])

    //     res.json(
    //         { Destino }
    //     )
    // } else {


    //     res.json(
    //         Destino
    //     )
    // }

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


const DeleteMessages = async (req,res=response)=>{

    
}



module.exports = {
    PostMessage,
    GetMessage,
    SearchToChat,
    SearchToChatInstructor,
    GetMessageEmitter,
    DeleteMessages,
    grabarMensaje,
    obtenerChat,
    ultimomensaje
}