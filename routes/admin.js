const { Router }=require('express');

const aCourses = require('../controllers/Acourses');
const aUsers = require('../controllers/Ausers');
const aPromotions = require('../controllers/Apromotions');
const aPayments = require('../controllers/Apayments');
const settings = require('../controllers/Asettings');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');


const router = Router();


/*-----------------------------------
--------------USERS------------------
-------------------------------------*/

router.get('/users',[validarJWT,validarCampos],aUsers.getUsers);
router.get('/instructores',[validarJWT,validarCampos],aUsers.getInstructors);
router.post('/inspectCourse',[validarJWT,validarCampos],aUsers.inspectCourse);

router.get('/admins',[validarJWT,validarCampos], aUsers.getAdmins);
router.post('/admin',[validarJWT,validarCampos], aUsers.postAdmin);
router.delete('/admin/:id',[validarJWT,validarCampos], aUsers.deleteAdmin);
router.put('/permits',[validarJWT,validarCampos], aUsers.putPermits);
router.get('/permits',[validarJWT,validarCampos], aUsers.getMyPermits);


router.post('/inspectCourse',[validarJWT,validarCampos],aUsers.inspectCourse);


/*-----------------------------------
--------------CURSOS-----------------
-------------------------------------*/

router.get('/cursosrevision',[validarJWT,validarCampos],aCourses.cursosRevision);
router.get('/cursospublicados',[validarJWT,validarCampos],aCourses.cursosPublicados);
router.put('/change-state-course', aCourses.changeStateCourse);
router.get('/coursesByInstructor/:idt',[validarJWT,validarCampos],aCourses.getCoursesFromInstructor);


router.put('/aceptarcourse/:idc',[validarJWT,validarCampos],aCourses.aceptarSolicitudCurso);

router.put('/rejectCourseRequest/:idc',[validarJWT,validarCampos],aCourses.denegarSolicitudCurso);

//observaciones de cursos
router.put('/sendremarks',[validarJWT,validarCampos], aCourses.sendRemark);

/*------------CATEGORÍAS---------------*/
router.get('/categories',[validarJWT,validarCampos], aCourses.getCategory);
router.get('/subcategory',[validarJWT,validarCampos], aCourses.getSubCategory);

router.post('/category',[validarJWT,validarCampos], aCourses.PostCategory);
router.post('/subcategory',[validarJWT,validarCampos], aCourses.PostSubCategory);
router.delete('/deletecategory/:idc',[validarJWT,validarCampos], aCourses.DeleteCategory);
router.delete('/deletesubcategory/:ids',[validarJWT,validarCampos], aCourses.DeleteSubCategory);
router.put('/putcategories',[validarJWT,validarCampos], aCourses.PutCategory);
router.put('/putsubcategories',[validarJWT,validarCampos], aCourses.PutSubcategory);

/*-----------PAQUETES--------------*/
router.get('/packages',[validarJWT,validarCampos], aCourses.getPackages);

router.get('/coursesPackage/:idP',[validarJWT,validarCampos], aCourses.getCoursesPackages);
router.put('/coursesPackage',[validarJWT,validarCampos], aCourses.putCoursesPackages);

router.post('/packages',[validarJWT,validarCampos], aCourses.postPackages);
router.put('/packages',[validarJWT,validarCampos], aCourses.putPackages);
router.delete('/package/:idP',[validarJWT,validarCampos], aCourses.deletePackage);


/*-----------------------------------
--------------PAGOS-----------------
-------------------------------------*/
router.get('/allPayments',[validarJWT,validarCampos], aPayments.HistoryPayments);
router.get('/orders',[validarJWT,validarCampos], aPayments.historyOrders);
router.get('/viewDeposit/:payment_status',[validarJWT,validarCampos], aPayments.viewDeposit);
router.put('/approveDeposit',[validarJWT,validarCampos], aPayments.approveDeposit);
router.put('/refuseDeposit',[validarJWT,validarCampos], aPayments.refuseDeposit);
router.get('/payments/summaryCoursesNoPaymentsByUserId/:idU',[validarJWT,validarCampos], aPayments.summaryCoursesNoPayment);
router.get('/payments/summaryInstructorsNoPayments',[validarJWT,validarCampos], aPayments.summaryNoPaymentInstructor);
router.get('/payments/detailOrdersNoPaymentsByCourseId/:idC',[validarJWT,validarCampos], aPayments.detailOrdersNoPaymentByCurso);
router.post('/payments/payInstructor',[validarJWT,validarCampos], aPayments.payInstructor);
//Historial de Pagos
router.get('/payments/historyPayments/:idU',[validarJWT,validarCampos], aPayments.getHistoryPaymentsInstructor);




/*-----------------------------------
--------------COMISIONES-----------------
-------------------------------------*/
router.get('/commissions',[validarJWT,validarCampos], aPayments.getCommissions);
router.put('/commissions',[validarJWT,validarCampos], aPayments.putCommissions);
router.get('/commissions/historial/graphic',[validarJWT,validarCampos], aPayments.historialCommissionsGraphic);


/*-----------------------------------
--------------PROMOCIONES-----------------
-------------------------------------*/
router.post('/discount',[validarJWT,validarCampos], aPromotions.postDiscount);
router.put('/discount',[validarJWT,validarCampos], aPromotions.putDiscount);
router.get('/discounts',[validarJWT,validarCampos], aPromotions.getDiscounts);
router.delete('/discount/:idD',[validarJWT,validarCampos], aPromotions.deleteDiscount);
router.get('/discount/:idD',[validarJWT,validarCampos], aPromotions.getDiscountCategories);

/*-----------------------------------
--------------SETTINGS-----------------
-------------------------------------*/

//BANK ACCOUNTS
router.get('/bankAccount',[validarJWT,validarCampos],settings.getBankAccounts);
router.post('/bankAccount',[validarJWT,validarCampos], settings.postBankAccount);
router.put('/bankAccount',[validarJWT,validarCampos],settings.putBankAccount);
router.delete('/bankAccount/:id',[validarJWT,validarCampos],settings.deleteBankAccount);

//BANNERS
router.get('/banner',[validarJWT,validarCampos], settings.getBanners);
router.post('/banner',[validarJWT,validarCampos], settings.postBanner);
router.put('/banner',[validarJWT,validarCampos], settings.putBanner);
router.delete('/banner/:id',[validarJWT,validarCampos], settings.deleteBanner);


module.exports=router;  