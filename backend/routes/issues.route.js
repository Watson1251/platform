const express = require("express");
const checkAuth = require("../middleware/check-auth");

const IssuesController = require("../controllers/issues.controller");

const router = express.Router();

router.get("/", checkAuth, IssuesController.getIssues);
router.get("/:id", checkAuth, IssuesController.getIssue);
router.post("/create", checkAuth, IssuesController.createIssue);
router.post("/update", checkAuth, IssuesController.updateIssue);
router.post("/delete", checkAuth, IssuesController.deleteIssue);

module.exports = router;
