const Note = require("../models/note.model");

exports.getNotes = (req, res, next) => {

  const noteQuery = Note.find();

  noteQuery
    .then(fetchedNotes => {
      res.status(200).json({
        message: "Notes fetched successfully!",
        notes: fetchedNotes
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching notes failed!"
      });
    });

};

exports.getNote = (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.status(200).json(note);
      } else {
        res.status(404).json({ message: "Note not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching note failed!"
      });
    });
};

exports.createNote = (req, res, next) => {

  const note = new Note({
    note: req.body.note,
    noted_by: req.body.noted_by,
    note_timestamp: Date.now(),
  });

  note
    .save()
    .then(createdNote => {
      res.status(201).json({
        message: "Note added successfully",
        note: {
          ...createdNote,
          id: createdNote._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a note failed!"
      });
    });

};

exports.updateNote = (req, res, next) => {

  const note = new Note({
    _id: req.body.id,
    note: req.body.note,
    noted_by: req.body.noted_by,
    note_timestamp: Number(req.body.note_timestamp),
  });

  Note.updateOne({ _id: note._id }, note)
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
        message: "Couldn't udpate note!"
      });
    });
};

exports.deleteNote = (req, res, next) => {

  Note.deleteOne({ _id: req.body.id })
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
        message: "Deleting note failed!"
      });
    });
};
