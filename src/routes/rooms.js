const express = require("express");

const RoomsController = require("../controllers/rooms-controller");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/find", checkAuth, RoomsController.findRooms);
router.get("/:id", checkAuth, RoomsController.getRoomInfo);

module.exports = router;
