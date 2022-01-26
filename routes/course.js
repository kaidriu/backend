const {Router}=require('express');
const { getCursos, SolicitudCurso } = require('../controllers/course');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();



router.get('/getcurso',[validarJWT,validarCampos],getCursos);

router.post('/curso',[validarJWT,validarCampos],SolicitudCurso);

module.exports=router;  