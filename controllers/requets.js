const { response } = require('express');
const db = require('../database/db')
const Request=db.requestI;
const RequestC=db.requestC;
const User=db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;


const SolicitudInstructor = async(req,res=response)=>{

    const  {aboutMe,linkYT,category} =req.body;
    const {id} = req.usuario;

    const usuario = await User.findByPk(id);

    const state = "pendiente";
    const profileId = id;


    const requestI = new Request({aboutMe,linkYT,category,state,profileId});

    await requestI.save();

    const requ = await Request.findOne({
        where: {profileId},
        include: [
            {
                model: Profile,
            }
        ],
      
    });

    res.json({
        requ
    })

}

const getSolicitudInstructor = async(req,res=response)=>{

    const request = await Request.findAll({
        attributes: {exclude: ['updatedAt','profileId'] },
        include: [
            {
                model: Profile,
                attributes: {exclude: ['createdAt','updatedAt','ubicationId','userTypeId','userDetailId','profession','aboutMe','phone','education','edad','gender'] },
                     include: [
                         {
                             model: User,
                             attributes: {exclude: ['password','createdAt','updatedAt','id','email','is_active','google','profileId'] },
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

    res.json({
        request
    })

}


const SolicitudCurso = async(req,res=response)=>{

    const  {name,linkYt,category,info,certificate,startDate,finishDate,price} =req.body;
    const {id} = req.usuario;

    const usuario = await User.findByPk(id);

    const state = "pendiente";
    const profileId = id;


    const requestC = new RequestC({name,linkYt,category,info,certificate,startDate,finishDate,price,state,profileId});

    await requestC.save();

    const requC = await RequestC.findOne({
        where: {name},
        include: [
            {
                model: Profile,
            }
        ],
      
    });

    res.json({
        requC
    })

}

const getSolicitudCurso = async(req,res=response)=>{

    const request = await RequestC.findAll({
        attributes: {exclude: ['createdAt','updatedAt','profileId'] },
        include: [
            {
                model: Profile,
                attributes: {exclude: ['createdAt','updatedAt','ubicationId','userTypeId','userDetailId'] },
                     include: [
                         {
                             model: User,
                             attributes: {exclude: ['password','createdAt','updatedAt','id'] },
                         },
                         {
                             model: Ubication,
                             attributes: {exclude: ['createdAt','updatedAt','id'] },
                         },
                         {
                             model: UserDetails,
                             attributes: {exclude: ['createdAt','updatedAt','id'] },
                         },
                         {
                             model:Type,
                             attributes: {exclude: ['createdAt','updatedAt','id'] },
                         }
                     ],
            } 
        ]   
    });

    res.json({
        request
    })

}


module.exports={
    SolicitudInstructor,
    SolicitudCurso,
    getSolicitudInstructor,
    getSolicitudCurso   
}