require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CONSTANTS = require("../helpers/constants");
const User = require("../models/user");
const RoomsController = require("./rooms-controller");

exports.signup = (req, res, next) => {
  if (!validPassword(req.body.password)) {
    return res.status(422).json({ message: "Cannot use this password" });
  }

  User.findOne({
    nickname: req.body.nickname
  }).then(user => {
    if (user) {
      res.status(422).json({ message: "Duplicate nickname" });
    } else {
      hashPasswordAndRegisterUser(req, res);
    }
  }).catch(error => {
    res.status(500).json({ error: error });
  });
};

function validPassword(password) {
  return password.length >= 6 && password.length <= 32;
}

function hashPasswordAndRegisterUser(req, res) {
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) {
      res.status(500).json({ error: error });
    } else {
      createUser(hash, req, res);
    }
  });
}

function createUser(hash, req, res) {
  const user = new User({
    _id: new mongoose.Types.ObjectId,
    nickname: req.body.nickname,
    password: hash
  });

  user.save().then(
    () => res.status(201).json({ message: "OK" })
  ).catch(
    error => res.status(500).json({ error: error })
  );
}

exports.login = (req, res, next) => {
  User.findOne({
    nickname: req.body.nickname
  }).then(user => {
    if (user) {
      comparePasswords(user, req, res);
    } else {
      res.status(401).json({ message: "Auth failed" });
    }
  }).catch(error => {
    res.status(500).json({ error: error });
  });
};

function comparePasswords(user, req, res) {
  bcrypt.compare(req.body.password, user.password, (error, authorized) => {
    if (error) {
      res.status(401).json({ message: "Auth failed" });
    } else if (authorized) {
      returnToken(user, res);
    } else {
      res.status(401).json({ message: "Auth failed" });
    }
  });
}

function returnToken(user, res) {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: CONSTANTS.TOKEN_EXP }
  );

  res.status(200).json(token);
}

exports.findUser = (req, res, next) => {
  User.findOne({
    nickname: req.body.nickname
  }).then(user => {
    if (user && user._id.toString() !== req.userData.id) {
      RoomsController.findRoom(req.userData.id, user._id).then(room => {
        if (room) {
          res.status(200).json(user._id);
        } else {
          RoomsController.createRoom(req.userData.id, user._id).then(
            () => res.status(200).json(user._id)
          );
        }
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }).catch(error => {
    res.status(500).json({ error: error });
  });
};

exports.getUserData = (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user.nickname);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }).catch(error => {
    res.status(500).json({ error: error });
  });
};