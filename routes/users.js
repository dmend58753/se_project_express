const router = require("express").Router();

const { validateUserUpdate } = require("../middlewares/validation");
const{ getCurrentUser, updateCurrentUser } = require("../controllers/users");


router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateCurrentUser);



module.exports = router;