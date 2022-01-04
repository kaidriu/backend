const {Router} = require('express');
const { check } = require('express-validator');
const { validarEmail } = require('../helpers/db-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-JWT');
const {usuariosPost, usuariosGet, usuariosPut, usuariosPassword}=require('../controllers/usuarios');


const router = Router();


router.post('/registrar', 

[
    check('name','El nombre debe ser obligatorio').not().isEmpty(),
    check('password','El password debe contener mas de 6 caracteres,letra mayuscula, minuscula y numeros').isLength({min:6}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
    check('email','No cumple los parametros del correo').isEmail(),
    check('email').custom(validarEmail),
    validarCampos
]
,usuariosPost);

router.get('/:id',usuariosGet);


router.put('/perfil',[validarJWT,validarCampos],usuariosPut);

router.put('/password',[validarJWT,validarCampos],usuariosPassword);

module.exports=router;