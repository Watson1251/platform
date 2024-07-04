const express = require("express");
const checkAuth = require("../middleware/check-auth");

const FileUploadController = require("../controllers/file-upload.controller");

const router = express.Router();

router.post("/create", checkAuth, FileUploadController.createFile);

module.exports = router;
