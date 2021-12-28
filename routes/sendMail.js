const {Router}=require('express');
const { recoverPassword } = require('../controllers/sendmails');
const { validarEmail } = require('../middlewares/validar-email');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



router.post('/recuperar/:email',[validarEmail,validarCampos],recoverPassword);


module.exports=router;