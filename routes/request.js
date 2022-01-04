const {Router}=require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { SolicitudInstructor, SolicitudCurso } = require('../controllers/requets');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();



router.post('/instructor',[validarJWT,validarCampos],SolicitudInstructor);
router.post('/curso',[validarJWT,validarCampos],SolicitudCurso);


module.exports=router;