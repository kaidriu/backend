const {Router}=require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { SolicitudInstructor, SolicitudCurso, getSolicitudInstructor, getSolicitudCurso, aceptarSolicitudInstructor, denegarSolicitudInstructor, cantidadSolicitudesInstructor } = require('../controllers/requets');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.post('/instructor',[validarJWT,validarCampos],SolicitudInstructor);
router.post('/curso',[validarJWT,validarCampos],SolicitudCurso);
router.get('/getinstructor',[validarJWT,validarCampos],getSolicitudInstructor);
router.get('/getcurso',[validarJWT,validarCampos],getSolicitudCurso);
router.get('/aceptarInstructor/:id',[validarJWT,validarCampos],aceptarSolicitudInstructor);
router.get('/cantidadInstructores',[validarJWT,validarCampos],cantidadSolicitudesInstructor);
router.delete('/eliminarSolicitudInstructor/:id',[validarJWT,validarCampos],denegarSolicitudInstructor);


module.exports=router;  