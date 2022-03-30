const {Router}=require('express');
const { PostMessage, GetMessage, SearchToChat, SearchToChatInstructor } = require('../controllers/messages');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/postmessage',[validarJWT,validarCampos],PostMessage);
router.get('/getmessage',[validarJWT,validarCampos],GetMessage);

router.get('/searchTo',[validarJWT,validarCampos],SearchToChat);
router.get('/searchToInstructor',[validarJWT,validarCampos],SearchToChatInstructor);
    
module.exports=router;  