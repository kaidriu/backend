const { Router} = require('express');
const { getHistory, Putpaymentsinstructor, HistoryPayments, GraphicHistoryPayments, getHistoryInstructor, HistoryPaymentsdetails, GraphicHistoryPaymentsdetails } = require('../controllers/inst_payment_history');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const router = Router();


router.get('/getpayments',[validarJWT,validarCampos],getHistory);
router.put('/savepayments',[validarJWT,validarCampos],Putpaymentsinstructor);
router.get('/historypayments',[validarJWT,validarCampos],HistoryPayments);
router.get('/graphichistorypayments/:from/:to/:idC',[validarJWT,validarCampos],GraphicHistoryPayments);
router.get('/gethistoryintructor',[validarJWT,validarCampos],getHistoryInstructor);

router.get('/historypaymentsdetails/:idC/:valor/:from/:to',[validarJWT,validarCampos],HistoryPaymentsdetails);

router.get('/graphichistorypaymentsdetails/:idC',[validarJWT,validarCampos],GraphicHistoryPaymentsdetails);



module.exports=router;