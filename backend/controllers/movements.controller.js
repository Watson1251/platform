const Movement = require("../models/movement.model");

exports.getMovements = (req, res, next) => {

  const movementQuery = Movement.find();

  movementQuery
    .then(fetchedMovements => {
      res.status(200).json({
        message: "Movements fetched successfully!",
        movements: fetchedMovements
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching movements failed!"
      });
    });

};

exports.getMovement = (req, res, next) => {
  Movement.findById(req.params.id)
    .then(movement => {
      if (movement) {
        res.status(200).json(movement);
      } else {
        res.status(404).json({ message: "Movement not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching movement failed!"
      });
    });
};

exports.createMovement = (req, res, next) => {

  const movement = new Movement({
    movement_timestamp: Number(req.body.movement_timestamp),
    movement_from: req.body.movement_from,
    movement_to: req.body.movement_to,
    moved_by: req.body.moved_by,
    notes: req.body.notes
  });

  movement
    .save()
    .then(createdMovement => {
      res.status(201).json({
        message: "Movement added successfully",
        movement: {
          ...createdMovement,
          id: createdMovement._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a movement failed!"
      });
    });

};

exports.updateMovement = (req, res, next) => {

  const movement = new Movement({
    _id: req.body.id,
    movement_timestamp: Number(req.body.movement_timestamp),
    movement_from: req.body.movement_from,
    movement_to: req.body.movement_to,
    moved_by: req.body.moved_by,
    notes: req.body.notes
  });

  Movement.updateOne({ _id: movement._id }, movement)
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
        message: "Couldn't udpate movement!"
      });
    });
};

exports.deleteMovement = (req, res, next) => {

  Movement.deleteOne({ _id: req.body.id })
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
        message: "Deleting movement failed!"
      });
    });
};
