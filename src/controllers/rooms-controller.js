require("dotenv").config();
const mongoose = require("mongoose");

const Room = require("../models/room");

exports.createRoom = (userId1, userId2) => {
  const room = new Room({
    _id: new mongoose.Types.ObjectId,
    users: [userId1, userId2]
  });

  return new Promise((resolve, reject) => (
    room.save().then(
      room => resolve(room._id)
    ).catch(error => reject(error))
  ));
};

exports.findRooms = (req, res, next) => {
  Room.find({
    users: req.userData.id
  }).populate("users").then(rooms => {
    if (rooms) {
      const response = rooms.map(
        room => room.users.find(user => user._id.toString() !== req.userData.id)
      );
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }).catch(error => {
    res.status(500).json({ error: error });
  });
};

exports.findRoom = (userId1, userId2) => (
  new Promise((resolve, reject) => {
    Room.findOne({
      $and: [
        { users: userId1 },
        { users: userId2 }
      ]
    }).then(room => {
      if (room) {
        resolve(room);
      } else {
        resolve();
      }
    }).catch(error => reject(error));
  })
);

exports.getRoomInfo = (req, res, next) => (
  Room.findOne({
    $and: [
      { users: req.userData.id },
      { users: req.params.id }
    ]
  }).then(room => {
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }).catch(error => {
    res.status(500).json({ error: error });
  })
);