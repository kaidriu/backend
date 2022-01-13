const {response}= require('express');

const db = require('../database/db');
const { Op } = require("sequelize");



const User = db.user;
const Profile = db.profile;
const Ubication = db.Ubication;
const UserDetails = db.userDetails;
const Type = db.UserType;


const busquedaT = async(req,res=response)=>{

    let bus = req.params.busqueda;

    // bus = bus.map((item) => {
    //     return {$iLike: item};
    // });
    // const regex = new RegExp(bus);


    const usuario = await User.findAll({
        where:{
            name: {
                [Op.iRegexp]: bus
              }
        }
    
    });


    res.json(usuario)
}
module.exports={    
    busquedaT
 
}   