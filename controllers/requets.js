const { response } = require('express');
const db = require('../database/db')
const Request=db.requestI;
const RequestC=db.requestC;
const User=db.user;
const Profile = db.profile;


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


module.exports={
    SolicitudInstructor,
    SolicitudCurso
}