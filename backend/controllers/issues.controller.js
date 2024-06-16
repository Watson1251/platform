const Issue = require("../models/issue.model");

exports.getIssues = (req, res, next) => {

  const issueQuery = Issue.find();

  issueQuery
    .then(fetchedIssues => {
      res.status(200).json({
        message: "Issues fetched successfully!",
        issues: fetchedIssues
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching issues failed!"
      });
    });

};

exports.getIssue = (req, res, next) => {
  Issue.findById(req.params.id)
    .then(issue => {
      if (issue) {
        res.status(200).json(issue);
      } else {
        res.status(404).json({ message: "Issue not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching issue failed!"
      });
    });
};

exports.createIssue = (req, res, next) => {

  const issue = new Issue({
    issue_timestamp: Number(req.body.issue_timestamp),
    issue: req.body.issue,
    issue_status: req.body.issue_status,
    issued_by: req.body.issued_by,
    assigned_to: req.body.assigned_to,
    notes: req.body.notes
  });

  issue
    .save()
    .then(createdIssue => {

      res.status(201).json({
        message: "Issue added successfully",
        issue: {
          ...createdIssue,
          id: createdIssue._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a issue failed!"
      });
    });

};

exports.updateIssue = (req, res, next) => {

  const issue = new Issue({
    _id: req.body.id,
    issue_timestamp: Number(req.body.issue_timestamp),
    issue: req.body.issue,
    issue_status: req.body.issue_status,
    issued_by: req.body.issued_by,
    assigned_to: req.body.assigned_to,
    notes: req.body.notes
  });

  Issue.updateOne({ _id: issue._id }, issue)
    .then(result => {

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Update failed!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Couldn't udpate issue!"
      });
    });
};

exports.deleteIssue = (req, res, next) => {

  Issue.deleteOne({ _id: req.body.id })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Deletion failed!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Deleting issue failed!"
      });
    });
};
