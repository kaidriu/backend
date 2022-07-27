const {Router}=require('express');
const { cursosPublicados, cursosRevision, sendRemark, changeStateCourse, getCoursesFromInstructor } = require('../controllers/Acourses');
const {getUsers, getInstructors} = require('../controllers/Ausers');
const {HistoryPayments, viewDeposit} = require('../controllers/Apayments');
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

/*-----------------------------------
--------------PAGOS-----------------
-------------------------------------*/
router.get('/allPayments',[validarJWT,validarCampos],HistoryPayments)
router.get('/viewDeposit',[validarJWT,validarCampos],viewDeposit)


module.exports=router;  