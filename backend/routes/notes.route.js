const express = require("express");
const checkAuth = require("../middleware/check-auth");

const NotesController = require("../controllers/notes.controller");

const router = express.Router();

router.get("/", checkAuth, NotesController.getNotes);
router.get("/:id", checkAuth, NotesController.getNote);
router.post("/create", checkAuth, NotesController.createNote);
router.post("/update", checkAuth, NotesController.updateNote);
router.post("/delete", checkAuth, NotesController.deleteNote);

module.exports = router;
