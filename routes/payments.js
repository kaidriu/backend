const {Router}=require('express');
const { CreateOrder, CaptureOrder, CancelOrder, addCar, getCar, deleteCar, addFav, getFav, deleteFav, SaveOrder, deleteallcar } = require('../controllers/payments');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.post('/create-order',[validarJWT,validarCampos],CreateOrder);

router.get('/capture-order/:id/:ido',CaptureOrder);

router.get('/cancel-order/:ido',CancelOrder);



router.post('/addcar',[validarJWT,validarCampos],addCar);

router.get('/getcar',[validarJWT,validarCampos],getCar);

router.delete('/deletecar/:idch',[validarJWT,validarCampos],deleteCar);



router.post('/addfav',[validarJWT,validarCampos],addFav);

router.get('/getfav',[validarJWT,validarCampos],getFav);

router.delete('/deletefav/:idch',[validarJWT,validarCampos],deleteFav);



router.delete('/deleteallcar',[validarJWT,validarCampos],deleteallcar);


router.post('/saveorder',[validarJWT,validarCampos],SaveOrder);


    
module.exports=router;  