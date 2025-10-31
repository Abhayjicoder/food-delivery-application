const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("video"),
    foodController.createFood)


/* GET /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems)


router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)


router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)


/* GET /api/food/partner [protected] - foods for the authenticated food-partner */
router.get('/partner',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.getPartnerFoods
)

/* DELETE /api/food/:id [protected] - delete a food item (owner only) */
router.delete('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.deleteFood
)

router.patch('/:id',
    authMiddleware.authFoodPartnerMiddleware,
    foodController.updateFood
)



module.exports = router