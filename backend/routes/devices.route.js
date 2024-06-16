const express = require("express");
const checkAuth = require("../middleware/check-auth");

const DevicesController = require("../controllers/devices.controller");

const router = express.Router();

router.get("/", checkAuth, DevicesController.getDevices);
router.get("/:id", checkAuth, DevicesController.getDevice);
router.post("/create", checkAuth, DevicesController.createDevice);
router.post("/update", checkAuth, DevicesController.updateDevice);
router.post("/delete", checkAuth, DevicesController.deleteDevice);

module.exports = router;
