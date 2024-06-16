const express = require("express");
const checkAuth = require("../middleware/check-auth");

const MovementsController = require("../controllers/movements.controller");

const router = express.Router();

router.get("/", checkAuth, MovementsController.getMovements);
router.get("/:id", checkAuth, MovementsController.getMovement);
router.post("/create", checkAuth, MovementsController.createMovement);
router.post("/update", checkAuth, MovementsController.updateMovement);
router.post("/delete", checkAuth, MovementsController.deleteMovement);

module.exports = router;
