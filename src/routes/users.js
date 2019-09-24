const express = require("express");

const UsersController = require("../controllers/users-controller");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/signup", UsersController.signup);
router.post("/login", UsersController.login);
router.post("/find", checkAuth, UsersController.findUser);

module.exports = router;
