const {Router}=require('express');
const { getBankAccounts, CreateOrder, CaptureOrder, CancelOrder, addCar, getCar, deleteCar, addFav, getFav, deleteFav, SaveOrder, deleteallcar, payDeposit, viewDeposit, putDeposit, deleteFavoriteInArray, getPackage, getCoursesInPackage, buyPackage, viewFactura } = require('../controllers/payments');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

router.post('/create-order',[validarJWT,validarCampos],CreateOrder);

router.get('/capture-order/:id/:ido',CaptureOrder);

router.get('/cancel-order/:ido',CancelOrder);



router.post('/addcar',[validarJWT,validarCampos],addCar);

router.get('/getcar',[validarJWT,validarCampos],getCar);

router.delete('/deletecar/:idch',[validarJWT,validarCampos],deleteCar);

router.get('/getPackageCourse',getPackage);
router.get('/getPackageInCourse/:id',getCoursesInPackage);
router.post('/buyPackage',[validarJWT,validarCampos],buyPackage);




router.post('/addfav',[validarJWT,validarCampos],addFav);

router.get('/getfav',[validarJWT,validarCampos],getFav);

router.delete('/deletefav/:idch',[validarJWT,validarCampos],deleteFav);
router.delete('/deleteFavoriteArray/:ids',[validarJWT,validarCampos],deleteFavoriteInArray);



router.delete('/deleteallcar',[validarJWT,validarCampos],deleteallcar);


router.post('/saveorder',[validarJWT,validarCampos],SaveOrder);

router.post('/payDeposit',[validarJWT,validarCampos],payDeposit);
router.get('/viewDeposit',[validarJWT,validarCampos],viewDeposit);
router.get('/viewFactura',[validarJWT,validarCampos],viewFactura);
router.put('/putDeposit/:id',[validarJWT,validarCampos],putDeposit);

// Info
router.get('/bank_accounts', getBankAccounts);


    
module.exports=router;  