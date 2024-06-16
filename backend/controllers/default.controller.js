const Permission = require("../models/permission.model");
const Role = require("../models/role.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getPermission = (req, res, next) => {

  const permissionQuery = Permission.find({permission: req.body.permission});
  permissionQuery
    .then(permission => {
      if (permission.length > 0) {
        res.status(200).json({
          message: "Permission added successfully",
          permission: {
            ...permission,
            id: permission._id
          }
        });
      } else {

        const permissionModel = new Permission({
          permission: req.body.permission,
        });

        permissionModel
          .save()
          .then(createdPermission => {
            res.status(201).json({
              message: "Permission added successfully",
              permission: {
                ...createdPermission,
                id: createdPermission._id
              }
            });
          });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching permission failed!"
      });
    });

};

exports.getRole = (req, res, next) => {

  const roleQuery = Role.find({role: req.body.role});
  roleQuery
    .then(role => {

      if (role.length > 0) {
        res.status(200).json({
          message: "Role added successfully",
          role: {
            ...role,
            id: role._id
          }
        });
      } else {

        const roleModel = new Role({
          role: req.body.role,
          permissions: req.body.permissions
        });

        roleModel
          .save()
          .then(createdRole => {
            res.status(201).json({
              message: "Role added successfully",
              role: {
                ...createdRole,
                id: createdRole._id
              }
            });
          });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching role failed!"
      });
    });

};

exports.getUser = (req, res, next) => {

  const userQuery = User.find({role: req.body.role});
  userQuery
    .then(user => {
      
      if (user.length > 0) {
        res.status(200).json({
          message: "User added successfully",
          user: true
        });
      } else {

        bcrypt.hash('admin', 10).then(hash => {
          const user = new User({
            name: 'admin',
            username: 'admin'.toLowerCase(),
            password: hash,
            isMale: true,
            role: req.body.role,
          });
      
          user
            .save()
            .then(result => {
              res.status(201).json({
                message: "User created!",
                user: true
              });
            })
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching role failed!"
      });
    });

};
