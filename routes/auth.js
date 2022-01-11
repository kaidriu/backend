const {Router} = require('express');
const { check } = require('express-validator');
const { login, renewToken, GoogleSingIn, loginadministrador } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const router = Router();


router.post('/login',[
    check('email','debe ingresar el email').isEmail(),
    check('password','debe ingresar el password').notEmpty(),
    validarCampos

],login);

router.post('/loginadministrador',[
    check('email','debe ingresar el email').isEmail(),
    check('password','debe ingresar el password').notEmpty(),
    validarCampos

],loginadministrador);


router.post('/login/google',
[
    check('token','debe ingresar el token').notEmpty(),
    validarCampos
],GoogleSingIn);


router.get( '/renew',
    validarJWT,
    renewToken
);

module.exports=router;