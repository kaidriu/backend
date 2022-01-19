const {response}= require('express');

const db = require('../database/db');

const Type = db.UserType;


const typesPost = async(req,res=response)=>{

    const usuario ="usuario";
    const administrador = "administrador";
    const instructor = "instructor";

    let type = new Type({nametype:usuario});
    await type.save();
    type = new Type({nametype:administrador});
    await type.save();
    type = new Type({nametype:instructor});
    await type.save();


    res.json({
        msg:"Guardado"
    })

}

module.exports={
    typesPost
}