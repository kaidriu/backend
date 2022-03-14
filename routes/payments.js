const {Router}=require('express');
const { CreateOrder, CaptureOrder, CancelOrder, addCar, getCar, deleteCar } = require('../controllers/payments');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.post('/create-order',[validarJWT,validarCampos],CreateOrder);

router.get('/capture-order/:id',CaptureOrder);

router.get('/cancel-order',CancelOrder);



router.post('/addcar',[validarJWT,validarCampos],addCar);

router.get('/getcar',[validarJWT,validarCampos],getCar);

router.delete('/deletecar/:idch',[validarJWT,validarCampos],deleteCar);


    
module.exports=router;  