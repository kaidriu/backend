const {Router}=require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { SolicitudInstructor, SolicitudCurso, getSolicitudInstructor, getSolicitudCurso } = require('../controllers/requets');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/instructor',[validarJWT,validarCampos],SolicitudInstructor);
router.post('/curso',[validarJWT,validarCampos],SolicitudCurso);
router.get('/getinstructor',getSolicitudInstructor);
router.get('/getcurso',[validarJWT,validarCampos],getSolicitudCurso);


module.exports=router;