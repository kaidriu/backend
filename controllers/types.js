const {response}= require('express');

const db = require('../database/db');

const Type = db.UserType;

const Country = db.country;


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


const getRoles = async (req,res=response)=>{

    const types = await Type.findAll();

    res.json(types);
}

const postCountry = async (req,res=response)=>{

    const{name_country}= req.body;

    const country = new Country({name_country});
    await country.save();

    res.json(country);
}

module.exports={
    typesPost,
    getRoles,
    postCountry
}