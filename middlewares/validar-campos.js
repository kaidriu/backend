const { validationResult } = require('express-validator');

const validarCampos = (req,res,next) =>{


    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }   
    
        next();
        
    } catch (error) {
        
    }

    

}

module.exports={validarCampos};