const {Router}=require('express');
const { busquedaT, cursosPublicados, cursosRevision, sendRemark } = require('../controllers/Acourses');
const {} = require('../controllers/Ausers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


/*-----------------------------------
--------------USERS------------------
-------------------------------------*/

router.get('/usuarios',[validarJWT,validarCampos],busquedaT)


/*-----------------------------------
--------------CURSOS-----------------
-------------------------------------*/

router.get('/cursosrevision',[validarJWT,validarCampos],cursosRevision)
router.get('/cursospublicados',[validarJWT,validarCampos],cursosPublicados)
router.put('/sendremark',[validarJWT,validarCampos], sendRemark)


module.exports=router;  