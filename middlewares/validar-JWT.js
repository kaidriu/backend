const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const User = db.user;



const validarJWT= async (req=request,res=response,next)=>{

    const token = req.header('x-token');

    if (!token){
        return res.json({
            msg: false
        })
    }

    try {

    const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);
    const usuario = await User.findByPk(uid);
    
    req.usuario = usuario;  

    next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


}


module.exports={validarJWT};