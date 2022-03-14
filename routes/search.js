const {Router}=require('express');
const { busquedaT, busquedaCurso, busquedaCursoFinal } = require('../controllers/search');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.get('/usuarios',[validarJWT,validarCampos],busquedaT)
router.get('/cursorevision',[validarJWT,validarCampos],busquedaCurso)
router.get('/cursopublicado',[validarJWT,validarCampos],busquedaCursoFinal)

module.exports=router;  