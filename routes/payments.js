const {Router}=require('express');
const { CreateOrder, CaptureOrder, CancelOrder } = require('../controllers/payments');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.post('/create-order',CreateOrder);

router.get('/capture-order',CaptureOrder);

router.get('/cancel-order',CancelOrder);

    
module.exports=router;  