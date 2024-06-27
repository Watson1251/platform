const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const e = require("express");


exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username.toLowerCase() })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (res.statusCode == 401) {
        return;
      }
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 24 * 60 * 60,
        userId: fetchedUser._id,
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
