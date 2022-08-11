const {Router}=require('express');
const { 
    cursosPublicados, 
    cursosRevision, 
    sendRemark, 
    changeStateCourse, 
    getCoursesFromInstructor,
    getPackages,
    postPackages } = require('../controllers/Acourses');
const {getUsers, getInstructors} = require('../controllers/Ausers');
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
    summaryNoPaymentInstructor,
    detailOrdersNoPaymentByCurso,
    payInstructor,
    getHistoryPaymentsInstructor} = require('../controllers/Apayments');
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
router.post('/packages',[validarJWT,validarCampos],postPackages)



/*-----------------------------------
--------------PAGOS-----------------
-------------------------------------*/
router.get('/allPayments',[validarJWT,validarCampos],HistoryPayments)
router.get('/orders',[validarJWT,validarCampos],historyOrders)
router.get('/viewDeposit/:payment_status',[validarJWT,validarCampos],viewDeposit)
router.put('/approveDeposit',[validarJWT,validarCampos],approveDeposit)
router.put('/refuseDeposit',[validarJWT,validarCampos],refuseDeposit)
router.get('/payments/summaryCoursesNoPaymentsByUserId/:idU',[validarJWT,validarCampos],summaryCoursesNoPayment)
router.get('/payments/summaryInstructorsNoPayments',[validarJWT,validarCampos],summaryNoPaymentInstructor)
router.get('/payments/detailOrdersNoPaymentsByCourseId/:idC',[validarJWT,validarCampos],detailOrdersNoPaymentByCurso)
router.post('/payments/payInstructor',[validarJWT,validarCampos],payInstructor)
//Historial de Pagos
router.get('/payments/historyPayments/:idU',[validarJWT,validarCampos],getHistoryPaymentsInstructor)




/*-----------------------------------
--------------COMISIONES-----------------
-------------------------------------*/
router.get('/commissions',[validarJWT,validarCampos],getCommissions)
router.put('/commissions',[validarJWT,validarCampos],putCommissions)
router.get('/commissions/historial/graphic',[validarJWT,validarCampos],historialCommissionsGraphic)



module.exports=router;  