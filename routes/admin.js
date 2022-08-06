const {Router}=require('express');
const { cursosPublicados, cursosRevision, sendRemark, changeStateCourse, getCoursesFromInstructor } = require('../controllers/Acourses');
const {getUsers, getInstructors} = require('../controllers/Ausers');
const {getPackages} = require('../controllers/Apackages');
const { 
    HistoryPayments, 
    viewDeposit, 
    approveDeposit, 
    refuseDeposit, 
    historyOrders, 
    getCommissions, 
    putCommissions, 
    historialCommissionsGraphic, 
    summaryCoursesNoPayment,
    summaryNoPaymentInstructor} = require('../controllers/Apayments');
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
router.put('/change-state-course',[validarJWT,validarCampos], changeStateCourse)
router.get('/coursesByInstructor/:idt',[validarJWT,validarCampos],getCoursesFromInstructor)
//observaciones de cursos
router.put('/sendremarks',[validarJWT,validarCampos], sendRemark)

/*-----------PAQUETES--------------*/
router.get('/packages',[validarJWT,validarCampos],getPackages)


/*-----------------------------------
--------------PAGOS-----------------
-------------------------------------*/
router.get('/allPayments',[validarJWT,validarCampos],HistoryPayments)
router.get('/orders',[validarJWT,validarCampos],historyOrders)
router.get('/viewDeposit/:payment_status',[validarJWT,validarCampos],viewDeposit)
router.put('/approveDeposit',[validarJWT,validarCampos],approveDeposit)
router.put('/refuseDeposit',[validarJWT,validarCampos],refuseDeposit)
router.get('/payments/summaryCoursesNoPaymentsByUserId/:idU',[validarJWT,validarCampos],summaryCoursesNoPayment)
router.get('/payments/summary/instructors',[validarJWT,validarCampos],summaryNoPaymentInstructor)



/*-----------------------------------
--------------COMISIONES-----------------
-------------------------------------*/
router.get('/commissions',[validarJWT,validarCampos],getCommissions)
router.put('/commissions',[validarJWT,validarCampos],putCommissions)
router.get('/commissions/historial/graphic',[validarJWT,validarCampos],historialCommissionsGraphic)



module.exports=router;  