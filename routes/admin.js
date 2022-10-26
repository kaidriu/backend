const {Router}=require('express');
const { 
    cursosPublicados, 
    cursosRevision, 
    sendRemark, 
    changeStateCourse, 
    getCoursesFromInstructor,
    getPackages,
    postPackages,
    putPackages,
    deletePackage,
    getCoursesPackages,
    aceptarSolicitudCurso, 
    denegarSolicitudCurso, 
    PostCategory, 
    PostSubCategory, 
    DeleteCategory, 
    PutCategory, 
    PutSubcategory, 
    DeleteSubCategory,
    putCoursesPackages} = require('../controllers/Acourses');
    
const {getUsers, getInstructors, inspectCourse} = require('../controllers/Ausers');
const {postDiscount, putDiscount, getDiscounts, deleteDiscount, getDiscountCategories} = require('../controllers/Apromotions');
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

const settings = require('../controllers/Asettings');

const router = Router();


/*-----------------------------------
--------------USERS------------------
-------------------------------------*/

router.get('/users',[validarJWT,validarCampos],getUsers)
router.get('/instructores',[validarJWT,validarCampos],getInstructors)
router.post('/inspectCourse',[validarJWT,validarCampos],inspectCourse)


/*-----------------------------------
--------------CURSOS-----------------
-------------------------------------*/

router.get('/cursosrevision',[validarJWT,validarCampos],cursosRevision)
router.get('/cursospublicados',[validarJWT,validarCampos],cursosPublicados)
router.put('/change-state-course', changeStateCourse)
router.get('/coursesByInstructor/:idt',[validarJWT,validarCampos],getCoursesFromInstructor)


router.put('/aceptarcourse/:idc',[validarJWT,validarCampos],aceptarSolicitudCurso);

router.put('/rejectCourseRequest/:idc',[validarJWT,validarCampos],denegarSolicitudCurso);

//observaciones de cursos
router.put('/sendremarks',[validarJWT,validarCampos], sendRemark)

/*------------CATEGORÍAS---------------*/
router.post('/category',[validarJWT,validarCampos],PostCategory);
router.post('/subcategory',[validarJWT,validarCampos],PostSubCategory);
router.delete('/deletecategory/:idc',[validarJWT,validarCampos],DeleteCategory);
router.delete('/deletesubcategory/:ids',[validarJWT,validarCampos],DeleteSubCategory);
router.put('/putcategories',[validarJWT,validarCampos],PutCategory);
router.put('/putsubcategories',[validarJWT,validarCampos],PutSubcategory);

/*-----------PAQUETES--------------*/
router.get('/packages',[validarJWT,validarCampos],getPackages);

router.get('/coursesPackage/:idP',[validarJWT,validarCampos],getCoursesPackages);
router.put('/coursesPackage',[validarJWT,validarCampos],putCoursesPackages);

router.post('/packages',[validarJWT,validarCampos],postPackages);
router.put('/packages',[validarJWT,validarCampos],putPackages);
router.delete('/package/:idP',[validarJWT,validarCampos],deletePackage);


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


/*-----------------------------------
--------------PROMOCIONES-----------------
-------------------------------------*/
router.post('/discount',[validarJWT,validarCampos],postDiscount);
router.put('/discount',[validarJWT,validarCampos],putDiscount);
router.get('/discounts',[validarJWT,validarCampos],getDiscounts);
router.delete('/discount/:idD',[validarJWT,validarCampos],deleteDiscount);
router.get('/discount/:idD',[validarJWT,validarCampos],getDiscountCategories);

/*-----------------------------------
--------------SETTINGS-----------------
-------------------------------------*/

//BANK ACCOUNTS
router.get('/bankAccount',[validarJWT,validarCampos],settings.getBankAccounts);
router.post('/bankAccount',[validarJWT,validarCampos], settings.postBankAccount);
router.put('/bankAccount',[validarJWT,validarCampos],settings.putBankAccount);
router.delete('/bankAccount/:id',[validarJWT,validarCampos],settings.deleteBankAccount);

//BANNERS
router.get('/banner',[validarJWT,validarCampos],settings.getBanners);
router.post('/banner',[validarJWT,validarCampos],settings.postBanner);
router.delete('/banner/:id',[validarJWT,validarCampos],settings.deleteBanner);


module.exports=router;  