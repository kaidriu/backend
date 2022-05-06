const { Router} = require('express');
const { getHistory, Putpaymentsinstructor, HistoryPayments, GraphicHistoryPayments, getHistoryInstructor, HistoryPaymentsdetails } = require('../controllers/inst_payment_history');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const router = Router();


router.get('/getpayments',[validarJWT,validarCampos],getHistory);
router.put('/savepayments',[validarJWT,validarCampos],Putpaymentsinstructor);
router.get('/historypayments',[validarJWT,validarCampos],HistoryPayments);
router.get('/graphichistorypayments',[validarJWT,validarCampos],GraphicHistoryPayments);
router.get('/gethistoryintructor',[validarJWT,validarCampos],getHistoryInstructor);

router.get('/historypaymentsdetails/:idC',[validarJWT,validarCampos],HistoryPaymentsdetails);



module.exports=router;