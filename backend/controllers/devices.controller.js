const Device = require("../models/device.model");

exports.getDevices = (req, res, next) => {

  const deviceQuery = Device.find();

  deviceQuery
    .then(fetchedDevices => {
      res.status(200).json({
        message: "Devices fetched successfully!",
        devices: fetchedDevices
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching devices failed!"
      });
    });

};

exports.getDevice = (req, res, next) => {
  Device.findById(req.params.id)
    .then(device => {
      if (device) {
        res.status(200).json(device);
      } else {
        res.status(404).json({ message: "Device not found!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching device failed!"
      });
    });
};

exports.createDevice = (req, res, next) => {

  const device = new Device({
    serial: req.body.serial,
    assigned_department: req.body.assigned_department,
    location: req.body.location,
    deployment_timestamp: Number(req.body.deployment_timestamp),
    default_password: req.body.default_password,
    version: req.body.version,
    openIssues: req.body.openIssues,
    movements: req.body.movements,
    issues: req.body.issues,
    notes: req.body.notes
  });

  device
    .save()
    .then(createdDevice => {
      res.status(201).json({
        message: "Device added successfully",
        device: {
          ...createdDevice,
          id: createdDevice._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a device failed!"
      });
    });

};

exports.updateDevice = (req, res, next) => {

  const device = new Device({
    _id: req.body.id,
    serial: req.body.serial,
    assigned_department: req.body.assigned_department,
    location: req.body.location,
    deployment_timestamp: Number(req.body.deployment_timestamp),
    default_password: req.body.default_password,
    version: req.body.version,
    openIssues: req.body.openIssues,
    movements: req.body.movements,
    issues: req.body.issues,
    notes: req.body.notes
  });

  Device.updateOne({ _id: device._id }, device)
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
        message: "Couldn't udpate device!"
      });
    });
};

exports.deleteDevice = (req, res, next) => {

  Device.deleteOne({ _id: req.body.id })
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
        message: "Deleting device failed!"
      });
    });
};
