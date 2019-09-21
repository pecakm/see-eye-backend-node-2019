const express = require("express");

const UsersController = require("../controllers/users-controller");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/signup", UsersController.signup);
router.post("/login", UsersController.login);
router.post("/find", checkAuth, UsersController.findUser);
// router.get("/data/:id", checkAuth, UsersController.getUserData);

module.exports = router;
