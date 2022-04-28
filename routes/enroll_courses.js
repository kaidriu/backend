const {Router}=require('express');
const {getEnrollCourse} = require('../controllers/enroll_courses');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();


router.get('/getenrollcourse/:id', getEnrollCourse);

    
module.exports=router;  