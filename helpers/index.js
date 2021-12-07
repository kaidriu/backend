

const dbValidators = require('./db-validator');
const generarJWT = require('./generarJWT');
const subirArchivo = require('./subir-archivo');


module.exports={
    ...dbValidators,
    ...generarJWT,
    ...subirArchivo
}