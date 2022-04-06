const {Router}=require('express');
const { busquedaT, cursosPublicados, cursosRevision, sendRemark, changeStateCourse } = require('../controllers/Acourses');
const {getUsers} = require('../controllers/Ausers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


/*-----------------------------------
--------------USERS------------------
-------------------------------------*/

router.get('/usuarios',[validarJWT,validarCampos],getUsers)


/*-----------------------------------
--------------CURSOS-----------------
-------------------------------------*/

router.get('/cursosrevision',[validarJWT,validarCampos],cursosRevision)
router.get('/cursospublicados',[validarJWT,validarCampos],cursosPublicados)
router.put('/sendremarks',[validarJWT,validarCampos], sendRemark)
router.put('/change-state-course',[validarJWT,validarCampos], changeStateCourse)


module.exports=router;  