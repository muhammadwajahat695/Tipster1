const express = require("express");
const router = express.Router();
require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); //generate unique token
const jwt = require("jsonwebtoken");
const Student = require("../models/StudentModel");
const BatchAdvisor = require("../models/BatchAdvisorModel");
const GuidanceBox = require("../models/guidance");
const Pastpaper = require("../models/pastpaper");
const Timetable = require("../models/timetable");
const CourseRequest = require("../models/DropCourse");
const FreezeSemester=require("../models/FreezeSemester")
const S_authenticate = require("../middleware/S_authenticate");
const BA_authenticate = require("../middleware/BA_authenticate");
const sendEmail = require("../middleware/sendemail");
const multer = require("multer");

//PAST PAPER
//view pastpaper
router.get("/papers/:course_title/:paper_type/:session", async (req, res) => {
    try {
      const searchField1 = req.params.course_title;
      const searchField2 = req.params.paper_type;
      const searchField3 = req.params.session;
      console.log(searchField1);
      const data = await Pastpaper.find({
        course_title: {
          $regex: searchField1,
          $options: "$eq",
        },
        paper_type: {
          $regex: searchField2,
          $options: "$eq",
        },
        session: {
          $regex: searchField3,
          $options: "$eq",
        },
      });
      if (!data) {
        res.status(200).send("no record found");
      } else {
        res.status(200).send(data);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });
  //view specific file
  router.get("/papers/:_id", async (req, res) => {
    try {
      const data = await Pastpaper.findById(req.params._id);
      if (!data) {
        res.status(200).send("no record found");
      } else {
        res.status(200).send(data);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../frontend/public/PastPapers");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "application/pdf") {
        cb(null, true);
      } else {
        cb(null, false);
        // res.send("only pdf alloowed")
        // return (cb(new Error('Only .pdf  format allowed!')));
      }
    },
  });
  //upload pastpaper
  router.post(
    "/upload_pastpapers",
    upload.single("paper"),
    S_authenticate,
    async (req, res) => {
      try {
        const uploadpaper = new Pastpaper({
          course_title: req.body.course_title,
          paper_type: req.body.paper_type,
          session: req.body.session,
          paper: `/PastPapers/${req.file.filename}`,
          paper_name: req.file.filename,
        });
        //  console.log("2")
        if (!uploadpaper) {
          res.status(400).send("eroor");
        } else {
          console.log(uploadpaper);
          await uploadpaper.save();
          res.send(uploadpaper);
        }
      } catch (error) {
        res.status(400).send("erroor");
      }
    }
  );
  

  module.exports = router;