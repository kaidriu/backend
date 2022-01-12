const {Router}=require('express');
const { getCursos } = require('../controllers/course');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();



router.get('/getcurso',[validarJWT,validarCampos],getCursos);



module.exports=router;  