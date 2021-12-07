const db = require('../database/db');

const User = db.user;
       
    

const validarEmail = async (email)=>{

    const existeEmail = await User.findOne({
        where:{
            email
        }
    });

    if(existeEmail){
        throw new Error(`Ya existe el email ${email}`)
    }

}


const encontrarUsuario = async(id)=>{

    const usuario = await User.findByPk(id);
    
    if(!usuario){
        throw new Error(`No exite el usuario con el id : ${id}`)
    }

}


const coleccionesPermitidas= (coleccion='',colecciones=[])=>{

    const incluida=colecciones.includes(coleccion);


    if(!incluida){
        throw new Error(`No es permitida la coleccion: ${coleccion}, ${colecciones}`)
    }
    
    return true;

}


module.exports={
    validarEmail,
    encontrarUsuario,
    coleccionesPermitidas
}
      
        