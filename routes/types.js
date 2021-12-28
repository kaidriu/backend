const {Router} = require('express');
const { typesPost } = require('../controllers/types');


const router = Router();


router.post('/',typesPost);

module.exports=router;