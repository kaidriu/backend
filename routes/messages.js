const {Router}=require('express');
const { PostMessage, GetMessage, SearchToChat, SearchToChatInstructor, GetMessageEmitter, obtenerChat, ultimomensaje } = require('../controllers/messages');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/postmessage/:idt',[validarJWT,validarCampos],PostMessage);
router.get('/getmessage/:idt',[validarJWT,validarCampos],GetMessage);

router.get('/getchat/:idt',[validarJWT,validarCampos],obtenerChat);

router.get('/getemitter',[validarJWT,validarCampos],GetMessageEmitter);

router.get('/ultimomensaje',[validarJWT,validarCampos],ultimomensaje);

router.get('/searchTo',[validarJWT,validarCampos],SearchToChat);
router.get('/searchToInstructor',[validarJWT,validarCampos],SearchToChatInstructor);



    
module.exports=router;  