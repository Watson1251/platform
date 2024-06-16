const express = require("express");
const checkAuth = require("../middleware/check-auth");

const DefaultController = require("../controllers/default.controller");

const router = express.Router();

router.post("/permission", DefaultController.getPermission);
router.post("/role", DefaultController.getRole);
router.post("/user", DefaultController.getUser);

module.exports = router;
