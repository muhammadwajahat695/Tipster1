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


//--------------Guidance Box-----------------
//------------------------need guidance-----------------
router.get("/needguidance/:course", S_authenticate, async (req, res) => {
    try {
      const course = req.params.course;
      console.log(course);
      const data = await GuidanceBox.find({
        courses: { $elemMatch: { course: course } },
      });
      if (!data) {
        res.status(400).send("error");
      } else {
        console.log(data);
        res.status(200).send(data);
      }
    } catch (error) {
      console.log(error);
    }
  });
  //---------------------want to guide---------------
  router.post("/want-to-guide/:course", S_authenticate, async (req, res) => {
    try {
      const course = req.params.course;
      const user = req.rootuser;
      const registrationId = user.registrationId;
      const name = user.name;
      const email = user.email;
      const contactNo = "--";
      const box = await GuidanceBox.findOne({ registrationId });
      if (!box) {
        const guide = new GuidanceBox({ registrationId, name, email, contactNo });
        await guide.save();
        await guide.add(course);
        await guide.save();
        res.send(guide);
      } else {
        const array = box.courses.length;
        // console.log(array);
        if (array === 0) {
          await box.add(course);
          await box.save();
          res.send(box);
        } else if (array === 1) {
          if (box.courses[array - 1].course === course) {
            return res.status(400).send("already present");
          } else {
            await box.add(course);
            await box.save();
            res.send(box);
          }
        } else if (array == 2) {
          if (
            box.courses[array - 1].course === course ||
            box.courses[array - 2].course === course
          ) {
            return res.status(400).send("already present");
          } else {
            await box.add(course);
            await box.save();
            res.send(box);
          }
        } else {
          res.status(400).send("limit full");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
//---------------------------add phone number or not
router.post("/wantToGuide_contact/:add", S_authenticate, async (req, res) => {
    const checkbox = req.params.add;
    console.log(checkbox);
    try {
      if (checkbox === "check") {
        const user = req.rootuser;
        const contactNo = user.contactNo;
        const registrationId = user.registrationId;
        console.log(registrationId);
        const data = await GuidanceBox.findOne({ registrationId });
        if (!data) {
          res.status(400).send("first add some courses");
        } else {
          await data.Contact(contactNo);
          await data.save();
          res.send(data);
        }
      } else {
        const user = req.rootuser;
        const contactNo = user.contactNo;
        const registrationId = user.registrationId;
        const data = await GuidanceBox.findOne({ registrationId });
        if (!data) {
          res.status(400).send("not show contact number");
        } else {
          if (data.contactNo === contactNo) {
            console.log(data.contactNo);
            data.contactNo = "--";
            await data.save();
            res.status(200).send(data);
          }
        }
      }
    } catch (error) {
      res.status(400).send("error");
    }
  });
  //-------------------delete the course that added for guide----------
  router.delete("/delete_course/:course", S_authenticate, async (req, res) => {
    try {
      const course = req.params.course;
      // console.log(course);
      // console.log("first")
      const user = req.rootuser;
      const registrationId = user.registrationId;
      const record = await GuidanceBox.findOne({
        registrationId,
      });
      //  console.log(record.courses[2].course)
  
      if (!record) {
        res.send("no record");
      } else {
        for (var i = 0; i < record.courses.length; i++) {
          if (record.courses[i].course === course) {
            await record.courses.splice(i, 1);
            await record.save();
            // res.send("deleted");
          }
        }
        if(record.courses.length===0){
          await record.delete();
        }
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });
  //-------------GET the data-----------------
  router.get("/guide_courses", S_authenticate, async (req, res) => {
    const user = req.rootuser;
    const registrationId = user.registrationId;
    const box = await GuidanceBox.findOne({ registrationId });
    if (!box) {
      res.status(200).send("no record found");
    } else {
      //  console.log(box);
      console.log("get the  data");
      res.send(box.courses);
    }
  });

  module.exports = router;