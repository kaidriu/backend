const { response } = require('express');
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

const SolicitudInstructor = async (req, res = response) => {

    const { aboutMe, linkYT, category } = req.body;
    const { id } = req.usuario;

    // const usuario = await User.findByPk(id);
    
    const ver = await Request.findOne({
        where: {
            [Op.and]: [
                { userId: id },
                { state: 'pendiente' }
            ]
        }
    })

    if (ver) {

        res.status(400).json({
            msg: "El usuario ya tienen una solicitud pendiente"
        })

    } else {

        const state = "pendiente";
        const userId = id;


        const requestI = new Request({ aboutMe, linkYT, category, state, userId });

        await requestI.save();

        const requ = await Request.findOne({
            where: { userId },
            include: [
                {
                    model: User,
                }
            ],

        });

        const variable = requ.createdAt;
        
        date = new Date(variable);
        year = date.getFullYear();
        month = date.getMonth();
        dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }

        let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


        let fecha = `${dt} - ${monthNames[month]} - ${year}`

        // const hora = await Request.findByPk(id);
        await requ.update({ fecha });



        res.json({
            requ
        })

    }



}

const getRequestInstructor = async (req, res = response) => {

    
    const { id } = req.usuario;

    const ver = await Request.findOne({
        where: {
            [Op.and]: [
                { userId: id },
                { state: 'pendiente' }
            ]
        }
    })

    const aceptado = await Request.findOne({
        where: {
            [Op.and]: [
                { userId: id },
                { state: 'aceptado' }
            ]
        }
    })

    if (aceptado) {

        res.status(200).json({estado: true })

    } else {
        if(ver){
            res.status(200).json({proceso:true})
        }else{
            res.status(200).json({proceso:false})
        }
      
    }

  

}



const getSolicitudInstructor = async (req, res = response) => {

    const request = await Request.findAll({
        order: [['id', 'ASC']],
        where: { state: 'pendiente' },
        attributes: { exclude: ['createdAt', 'updatedAt', 'profileId'] },
        include: [
            {
                model: User,
                attributes: ['name', 'email'],
                include: [
                    {
                        model: Profile,
                        attributes: ['image_perfil']
                    }
                ],
            }
        ]
    });

    res.json({
        request
    })

}




const getSolicitudCurso = async (req, res = response) => {

    const request = await RequestC.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'profileId'] },
        include: [
            {
                model: Profile,
                attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId'] },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: Ubication,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: UserDetails,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    },
                    {
                        model: Type,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
                    }
                ],
            }
        ]
    });

    res.json({
        request
    })

}

const aceptarSolicitudInstructor = async (req, res = response) => {

    const { id, ProfileId } = req.params;

    const request = await Request.findOne({
        where: { id },
        attributes: { exclude: ['updatedAt', 'profileId'] },
        include: [
            {
                model: Profile,
                attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId', 'profession', 'aboutMe', 'phone', 'education', 'edad', 'gender'] },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id', 'email', 'is_active', 'google', 'profileId'] },
                    },
                    //  {
                    //      model: Ubication,
                    //      attributes: {exclude: ['createdAt','updatedAt','id'] },
                    //  },
                    //  {
                    //      model: UserDetails,
                    //      attributes: {exclude: ['createdAt','updatedAt','id'] },
                    //  },
                    //  {
                    //      model:Type,
                    //      attributes: {exclude: ['createdAt','updatedAt','id'] },
                    //  }
                ],
            }
        ]
    });

    const state = 'aceptado';

    const profile = await Profile.findOne({
        where: { id: ProfileId }
    })
    const userTypeId = 3;

    await profile.update({ userTypeId })
    await request.update({ state });


    res.json({
        request
    })


}


const denegarSolicitudInstructor = async (req, res = response) => {

    const { id } = req.params;

    const request = await Request.findOne({

        where: { id },
        attributes: { exclude: ['updatedAt', 'profileId'] },
        include: [
            {
                model: Profile,
                attributes: { exclude: ['createdAt', 'updatedAt', 'ubicationId', 'userTypeId', 'userDetailId', 'profession', 'aboutMe', 'phone', 'education', 'edad', 'gender'] },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'id', 'email', 'is_active', 'google', 'profileId'] },
                    },
                    //  {
                    //      model: Ubication,
                    //      attributes: {exclude: ['createdAt','updatedAt','id'] },
                    //  },
                    //  {
                    //      model: UserDetails,
                    //      attributes: {exclude: ['createdAt','updatedAt','id'] },
                    //  },
                    //  {
                    //      model:Type,
                    //      attributes: {exclude: ['createdAt','updatedAt','id'] },
                    //  }
                ],
            }
        ]
    });


    await request.destroy({
        where: (id)
    });


    res.json({
        request
    })


}


const cantidadSolicitudesInstructor = async (req, res = response) => {

    const numeroSolicitudes = await Request.count({
        where:
            { state: 'pendiente' }

    });
    res.json({
        numeroSolicitudes
    })
}



module.exports = {
    SolicitudInstructor,
    getSolicitudInstructor,
    getSolicitudCurso,
    aceptarSolicitudInstructor,
    denegarSolicitudInstructor,
    cantidadSolicitudesInstructor,
    getRequestInstructor
}