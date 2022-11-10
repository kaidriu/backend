const { Router} = require('express');
const payments = require('../controllers/inst_payment_history');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const router = Router();


router.get('/getpayments',[validarJWT,validarCampos], payments.getHistory);
router.put('/savepayments',[validarJWT,validarCampos],payments.Putpaymentsinstructor);
router.get('/historypayments',[validarJWT,validarCampos],payments.HistoryPayments);
router.get('/graphichistorypayments/:from/:to/:idC',[validarJWT,validarCampos],payments.GraphicHistoryPayments);
router.get('/gethistoryintructor',[validarJWT,validarCampos],payments.getHistoryInstructor);

router.get('/historypaymentsdetails/:idC/:valor/:from/:to',[validarJWT,validarCampos],payments.HistoryPaymentsdetails);

router.get('/graphichistorypaymentsdetails/:idC',[validarJWT,validarCampos],payments.GraphicHistoryPaymentsdetails);

router.get('/getDetailsTransfers/:idT',[validarJWT,validarCampos],payments.getDetailTransfers);

router.get('/summaryCoursesNoPayments',[validarJWT,validarCampos], payments.summaryCoursesNoPayment);


//getDetailTransfers



module.exports=router;