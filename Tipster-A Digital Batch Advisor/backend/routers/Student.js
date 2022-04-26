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

//Student registration
router.post("/S_registration", async (req, res) => {
    try {
      const student = await Student.create(req.body);
      res.status(200).send(student);
    } catch (error) {
      console.log(error);
    }
  });
//Student Login
router.post("/Studentlogin", async (req, res) => {
    try {
      const { batch, regNo, password } = req.body;
      //filled the filed or not
      if (!batch || !regNo || !password) {
        return res.status(400).json({ error: "filled the data" });
      }
      const registrationId = batch.concat("-BCS-", regNo);
      // console.log(registrationId);
      const Studentlogin = await Student.findOne({
        registrationId: registrationId,
      });
      if (Studentlogin) {
        //check password from database
        // console.log(Studentlogin)
        const ismatch = await bcrypt.compare(password, Studentlogin.password);
        if (!ismatch) {
          return res.status(400).json({ error: "incorrect password" });
        } else {
          //toekn
          const token = await Studentlogin.generateAuthToken();
          // console.log(token);
          //add cookies
          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 2443000),
            httpOnly: true,
          });
          res.status(200).json({ message: "user signin successfully" });
        }
      } else {
        res.status(400).json({ error: "INCORRECT registration no" });
      }
    } catch (error) {
      console.log(error);
    }
  });
// Student Profile
router.get("/Studentprofile", S_authenticate, async (req, res) => {
    console.log("Get Student profile data");
    res.status(200).send(req.rootuser);
  });
///////////// update password
//update student password
router.put("/S_updatepassword", S_authenticate, async (req, res) => {
    const { old_password, new_password, confirm_password } = req.body;
    if (!old_password || !new_password || !confirm_password) {
      return res.status(400).json({ error: "filled the data" });
    }
    const student = await Student.findById(req.rootuser);
    //  console.log("Refeded");
    const isMatched = await bcrypt.compare(old_password, student.password);
    //  console.log("dhgafvasd");
    if (!isMatched) {
      return res.status(400).json({ error: "Old password is not Correct" });
    } else if (new_password != confirm_password) {
      return res.status(400).json({ error: "confirm password does not match" });
    }
    student.password = new_password;
    await student.save();
    //  sendToken(user, 200, res)
    res.status(200).send("Password updated successfully");
  }); 
//-----------------update contact number-------------------------------
//update student contact number
router.put("/S_updatecontact", S_authenticate, async (req, res) => {
    const student = await Student.findById(req.rootuser);
    //  console.log("Refeded");
    try {
      student.contactNo = req.body.contactNo;
      await student.save();
      res.status(200).send("phone number updated successfully");
    } catch (error) {
      return res
        .status(400)
        .json({ error: "enter the number in correct format" });
    }
  }); 
//--------------------------top menu--------------------
//top menu of Student
router.get("/S_Topmenu", S_authenticate, async (req, res) => {
    console.log("get top menu");
    res.status(200).send(req.rootuser);
  });
//-----------------------student logout--------------------------
router.get("/Studentlogout",S_authenticate, (req, res) => {
    res.clearCookie("jwtoken", { path: "/" });
    res.status(200).send("user logout");
  });
//---------------------home student-----------------------------
router.get("/Home", S_authenticate, async (req, res) => {
    console.log("get top menu");
    console.log(req.rootuserResult);
    const studentdata = req.rootuser;
    const batch = studentdata.batch;
    if ("SP22" === batch) {
      res.status(200).send(req.rootuserSemester1);
    } else if ("FA21" === batch) {
      res.status(200).send(req.rootuserSemester2);
    } else if ("SP21" === batch) {
      res.status(200).send(req.rootuserSemester3);
    } else if ("FA20" === batch) {
      res.status(200).send(req.rootuserSemester4);
    } else if ("SP20" === batch) {
      res.status(200).send(req.rootuserSemester5);
    } else if ("FA19" === batch) {
      res.status(200).send(req.rootuserSemester6);
    } else if ("SP19" === batch) {
      res.status(200).send(req.rootuserSemester7);
    } else if ("FA18" === batch) {
      res.status(200).send(req.rootuserSemester8);
    } else if ("SP18" === batch) {
      res.status(200).send(req.rootuserSemester8);
    } else if ("FA17" === batch) {
      res.status(200).send(req.rootuserSemester9);
    } else if ("SP17" === batch) {
      res.status(200).send(req.rootuserSemester10);
    } else if ("FA16" === batch) {
      res.status(200).send(req.rootuserSemester11);
    } else if ("FA16" === batch) {
      res.status(200).send(req.rootuserSemester12);
    } else {
      res.status(200).send("error");
    }
  });
//--------------------------reset password email for student-------------
router.post("/S_sendresetemail", async (req, res) => {
    try {
      const { email } = req.body;
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          console.log(err);
        } else {
          const token = buffer.toString("hex");
          const student = await Student.findOne({ email });
          //  console.log(user)
          if (!student) {
            return res.status(422).json({ error: "user does not found" });
          } else {
            student.resettoken = token;
            student.expiretoken = Date.now() + 3600000;
            await student.save();
            //  console.log(user);
            const to = student.email;
            const from = "z6680362@gmail.com";
            const subject = "reset password link";
            const html = `
                           <div
                             style="
                               text-align: center;
                               background-color: rgb(255, 193, 122);
                               margin-left: 00px;
                               margin-right: 00px;
                               padding-top: 1px;
                               padding-bottom: 70px;
                             "
                           >
                             <h2>Tipster</h2>
                             <h4 style="margin-top: -20px">A Digital Batch Advisor</h4>
                             <div>
                               <div
                                 style="
                                   background-color: rgb(255, 255, 255);
                                   margin-left: 30px;
                                   margin-right: 30px;
                                   padding-top: 30px;
                                   padding-bottom: 30px;
                                   border-radius: 5px;
                                 "
                               >
                                 <form action="">
                                   <h3 style="display: inline">Hello</h3>
                                   <h3 style="display: inline">${student.name},</h3>
                                   <h2>Forgot your password?</h2>
                                   <p style="font-size: 18px; padding-top: 10px">
                                     That's okay, it happens! Click on the button <br />below to reset
                                     your password.
                                   </p>
                                   <button
                                     style="
                                       background-color: rgb(0, 30, 129);
                                       padding: 10px 10px 10px 10px;
                                       border: none;
                                       border-radius: 5px;
                                       font-weight: bold;
                                       margin-top: 10px;
                                       color: white;
                                     "
                                   ><a href="http://localhost:3000/NewStudentPassword/${token}">
                                     RESET YOUR PASSWORD
                                   </button>
                                   <h4 style="margin-top: 40px; font-size: 15px">Regards,</h4>
                                   <h4 style="margin-top: -20px; font-size: 15px">The Tipster Team</h4>
                                 </form>
                               </div>
                             </div>
                           </div>
                                            
                       `;
            await sendEmail(to, from, subject, html);
            res.status(200).send("email send");
  
            //  const msg = {
            //      to: "user.email",
            //      from: "z6680362@gmail.com",
            //      subject: "for reset Password",
            //      html: `
            //    <p>hfdsfgdsjfgdsfgsjdfgdsgf</p>
            //    <h5>link in this <a href="http://localhost:3000/reset/${token}">link</a> to reset</h5>
            //   `
            //  }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
//--------------------reset password for student------------------
router.put("/S_resetpassword", async (req, res) => {
    try {
      const { new_password, confirm_password } = req.body;
      const sentToken = req.body.token;
      if (!new_password || !confirm_password) {
        return res.status(400).json({ error: "filled the data" });
      }
      if (new_password != confirm_password) {
        return res.status(400).json({ error: "confirm password does not match" });
      }
      // console.log(new_password);
      const student = await Student.findOne({
        resettoken: sentToken,
        expiretoken: { $gt: Date.now() },
      });
      //  console.log(user)
      if (!student) {
        res.status(422).json({ error: "token expire" });
      }
  
      //  const user = await User.findById(req.rootuser);
      //  console.log("Refeded");
  
      student.password = new_password;
      student.resettoken = undefined;
      student.expiretoken = undefined;
      await student.save();
      //  sendToken(user, 200, res)
      res.status(200).send("Password updated successfully");
    } catch (error) {
      console.log(error);
    }
  });
//Drop course request
router.post("/dropCourse_Request", S_authenticate, async (req, res) => {
    const { reason, courseName } = req.body;
    console.log(reason)
    console.log(courseName)
    try {
      const user = req.rootuser;
      const {
        name,
        email,
        contactNo,
        address,
        section,
        batch,
        semester,
        registrationId,
      } = user;
      const CGPA = user.Result[0].CGPA;
      if (semester === 1) {
        const record = req.rootuserSemester1;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester1[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section,
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send(
            "First add some course and then drop ----your credits hours less"
          );
        }
      } else if (semester === 2) {
        const record = req.rootuserSemester2;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        //  console.log("first",cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester2[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First  add some course and then drop");
        }
      } else if (semester === 3) {
        const record = req.rootuserSemester3;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        //  console.log("first",cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester3[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First some course and then drop");
        }
      } else if (semester === 4) {
        const record = req.rootuserSemester4;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        //  console.log("first",cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester4[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits,
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First some course and then drop");
        }
      } else if (semester === 5) {
        const record = req.rootuserSemester5;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        //  console.log("first",cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester5[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits,
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First some course and then drop");
        }
      } else if (semester === 6) {
        const record = req.rootuserSemester6;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        //  console.log("first",cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester6[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First some course and then drop");
        }
      } else if (semester === 7) {
        const record = req.rootuserSemester7;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        //  console.log("first",cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester7[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First some course and then drop");
        }
      } else if (semester === 8) {
        const record = req.rootuserSemester8;
        var cred = 0;
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].status === "enrolled") {
            cred += record[i].credits;
          }
        }
        console.log(cred)
        if (cred >= 15) {
          var abc = "";
          for (var i = 0; i < record.length; i++) {
            console.log(i);
            if (record[i].courseName === courseName) {
              abc = i;
            }
          }
          const courseCode = record[abc].courseCode;
          const credits = record[abc].credits;
          user.Result[0].Semester8[abc].status = "Drop Pending";
          const box = await CourseRequest.findOne({ registrationId });
          if (!box) {
            const data = new CourseRequest({
              batch,
              registrationId,
              semester: semester,
              name: name,
              email: email,
              contactNo: contactNo,
              address: address,
              CGPA: CGPA,
              section:section
            });
            await user.save();
            await data.save();
            await data.Courses1(courseCode, reason, courseName, credits);
            await data.save();
            res.send(data);
          } else {
            var match = "";
            for (var i = 0; i < box.courses.length; i++) {
              console.log(i);
              if (box.courses[i].courseName === courseName) {
                match = i;
              }
            }
            if (match === "") {
              console.log("first");
              await user.save();
              await box.Courses1(
                courseCode,
                reason,
                courseName,
                credits
              );
              await box.save();
              res.send(box);
            } else {
              console.log("first");
              res.status(400).send("this course request in pending");
            }
          }
        } else {
          res.status(400).send("First some course and then drop");
        }
      } else {
        res.status(400).send("error");
      }
    } catch (error) {
      res.status(400).send(error)
    }
  });
//for repeat courses
router.get("/repeatCourses", S_authenticate, async (req, res) => {
    const user = req.rootuser;
    const { semester } = user;
    if (semester === 1) {
      res.status(200).send("No course available for repeat");
    } else if (semester === 2) {
      const data = user.Result[0].Semester1;
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          var j = 0;
          await data1.push(data[i]);
          j++;
        }
      }
      res.send(data1);
    }else if (semester === 3) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
      );
      var data1 = [];                                 //store all courses that can repeat
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {             //no duplicate data enter
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      //check that the if he/she study that course later and improve gpa and that course remove from the repeat course array
      for (var i = 0; i < data.length; i++) {             
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            if (data[i].gp === data1[j].gp) {
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                await data1.push(data[k]);
              }
            }
          }
        }
      }
      res.send(data1);
    }else if (semester === 4) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            if (data[i].gp === data1[j].gp) {
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                await data1.push(data[k]);
              }
            }
          }
        }
      }
      res.send(data1);
    }else if (semester === 5) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            if (data[i].gp === data1[j].gp) {
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                await data1.push(data[k]);
              }
            }
          }
        }
      }
      res.send(data1);
    }else if (semester === 6) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            if (data[i].gp === data1[j].gp) {
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                await data1.push(data[k]);
              }
            }
          }
        }
      }
      res.send(data1);
    }else if (semester === 7) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5,
        user.Result[0].Semester6
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            if (data[i].gp === data1[j].gp) {
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                await data1.push(data[k]);
              }
            }
          }
        }
      }
      res.send(data1);
    }else if (semester === 8) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5,
        user.Result[0].Semester6,
        user.Result[0].Semester7
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            // for (var k=0; k<data.length;k++){
            // if(data1[j].courseName===data[k].courseName){
            if (data[i].gp === data1[j].gp) {
              // console.log(data1)
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
                // console.log(data1)
                // await data1.save()
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                //  await data1.save()
                await data1.push(data[k]);
              }
            }
            // }
            // }
          }
        }
      }
      res.send(data1);
    }else if (semester === 9) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5,
        user.Result[0].Semester6,
        user.Result[0].Semester7,
        user.Result[0].Semester8
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            // for (var k=0; k<data.length;k++){
            // if(data1[j].courseName===data[k].courseName){
            if (data[i].gp === data1[j].gp) {
              // console.log(data1)
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
                // console.log(data1)
                // await data1.save()
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                //  await data1.save()
                await data1.push(data[k]);
              }
            }
            // }
            // }
          }
        }
      }
      res.send(data1);
    }else if (semester === 10) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5,
        user.Result[0].Semester6,
        user.Result[0].Semester7,
        user.Result[0].Semester8,
        user.Result[0].Semester9
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            // for (var k=0; k<data.length;k++){
            // if(data1[j].courseName===data[k].courseName){
            if (data[i].gp === data1[j].gp) {
              // console.log(data1)
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
                // console.log(data1)
                // await data1.save()
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                //  await data1.save()
                await data1.push(data[k]);
              }
            }
            // }
            // }
          }
        }
      }
      res.send(data1);
    }else if (semester === 11) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5,
        user.Result[0].Semester6,
        user.Result[0].Semester7,
        user.Result[0].Semester8,
        user.Result[0].Semester9,
        user.Result[0].Semester10
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            // for (var k=0; k<data.length;k++){
            // if(data1[j].courseName===data[k].courseName){
            if (data[i].gp === data1[j].gp) {
              // console.log(data1)
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
                // console.log(data1)
                // await data1.save()
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                //  await data1.save()
                await data1.push(data[k]);
              }
            }
            // }
            // }
          }
        }
      }
      res.send(data1);
    }else if (semester === 12) {
      const data = user.Result[0].Semester1.concat(
        user.Result[0].Semester2,
        user.Result[0].Semester3,
        user.Result[0].Semester4,
        user.Result[0].Semester5,
        user.Result[0].Semester6,
        user.Result[0].Semester7,
        user.Result[0].Semester8,
        user.Result[0].Semester9,
        user.Result[0].Semester10,
        user.Result[0].Semester11
      );
      var data1 = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].gp < 2) {
          if (data1.length === 0) {
            await data1.push(data[i]);
          } else {
            for (var k = 0; k < data1.length; k++) {
              if (data1[k].courseName === data[i].courseName) {
                if (data[i].gp > data1[k].gp) {
                  await data1.splice(k, 1);
                  await data1.push(data[i]);
                } else {
                  console.log("this course already present");
                }
              } else {
                await data1.push(data[i]);
              }
            }
          }
        }
      }
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data1.length; j++) {
          if (data[i].courseName === data1[j].courseName) {
            // for (var k=0; k<data.length;k++){
            // if(data1[j].courseName===data[k].courseName){
            if (data[i].gp === data1[j].gp) {
              // console.log(data1)
            } else {
              if (data[i].gp >= 2) {
                await data1.splice(j, 1);
                // console.log(data1)
                // await data1.save()
              } else if (data[i].gp < 2) {
                await data1.splice(j, 1);
                //  await data1.save()
                await data1.push(data[k]);
              }
            }
            // }
            // }
          }
        }
      }
      res.send(data1);
    }
  });
  //-------------------FreezeSemester------------
  router.post("/freezeSemester",S_authenticate,async(req,res)=>{
    const {reason,continuationTime}=req.body;
    const user=req.rootuser
    const {batch,registrationId,email,name,contactNo,address,semester,section}=user
    const {CGPA}=user.Result[0]
     const freeze= new FreezeSemester({
      batch,registrationId,semester,name,address,contactNo,email,CGPA,reason,section,continuationTime
    })
    if(!freeze){
      res.send("error")
    }else{
      await freeze.save()
      res.send(freeze)
    }
  });
  //reject Freeze semster request------------------
  router.delete("/FreezeSemester_reject",async(req,res)=>{
    try {
      const {registrationId}=req.body;
      const data=await FreezeSemester.findOne({FreezeSemester})
      if(!data){
        res.status(400).send("no record found")
      }else{
        await data.delete();
        res.status(200).send("deleted");
      }
    } catch (error) {
      res.status(400).send(error)
    }
  }) 

module.exports = router;