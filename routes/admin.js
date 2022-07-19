const {Router}=require('express');
const { busquedaT, cursosPublicados, cursosRevision, sendRemark, changeStateCourse, getCoursesFromInstructor } = require('../controllers/Acourses');
const {getUsers, getInstructors} = require('../controllers/Ausers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


/*-----------------------------------
--------------USERS------------------
-------------------------------------*/

router.get('/usuarios',[validarJWT,validarCampos],getUsers)
router.get('/instructores',[validarJWT,validarCampos],getInstructors)


/*-----------------------------------
--------------CURSOS-----------------
-------------------------------------*/

router.get('/cursosrevision',[validarJWT,validarCampos],cursosRevision)
router.get('/cursospublicados',[validarJWT,validarCampos],cursosPublicados)
router.put('/sendremarks',[validarJWT,validarCampos], sendRemark)
router.put('/change-state-course',[validarJWT,validarCampos], changeStateCourse)
router.get('/coursesByInstructor/:idt',[validarJWT,validarCampos],getCoursesFromInstructor)


module.exports=router;  