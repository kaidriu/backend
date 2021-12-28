
const { response } = require('express');
const db = require('../database/db')

const User=db.user;

const validarEmail = async (req,res=response,next)=>{

    const {email} = req.params;

    const existeEmail = await User.findOne({
        where:{
            email
        }
    });
    if(!existeEmail){
        return res.status(400).json(`No hemos encontrado ninguna cuenta asociada a ${email}. Prueba con otro email`)
    }   

    next();

}

module.exports={
    validarEmail
}