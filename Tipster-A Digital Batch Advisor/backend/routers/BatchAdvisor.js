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

//Batch Advisor registration
router.post("/BA_registration", async (req, res) => {
    try { 
      const batchadvisor = await BatchAdvisor.create(req.body);
      res.status(200).send(batchadvisor);
    } catch (error) {
      console.log(error);
    }
  });

//for batch advisor login
router.post("/BatchAdvisorlogin", async (req, res) => {
    try {
      const { email, password } = req.body;
      //filled the filed or not
      if (!email || !password) {
        return res.status(400).json({ error: "filled the data" });
      }
      const Batchadvisorlogin = await BatchAdvisor.findOne({ email: email });
      if (Batchadvisorlogin) {
        //check password from database
        const ismatch = await bcrypt.compare(
          password,
          Batchadvisorlogin.password
        );
        if (!ismatch) {
          return res.status(400).json({ error: "incorrect password" });
        } else {
          //toekn
          const token = await Batchadvisorlogin.generateAuthToken();
          // console.log(token);
          //add cookies
          res.cookie("Bjwtoken", token, {
            expires: new Date(Date.now() + 244300000),
            httpOnly: true,
          });
          res.status(200).json({ message: "user signin successfully" });
        }
      } else {
        res.status(400).json({ error: "INCORRECT Email" });
      }
    } catch (error) {
      console.log(error);
    }
  });
//Batch Advisor profile
router.get("/BatchAdvisorprofile", BA_authenticate, async (req, res) => {
    console.log("Get the batch advisor profile data");
    res.status(200).send(req.rootuser);
  });
//-----------------update password-------------------
//update password batch advisor
router.put("/BA_updatepassword", BA_authenticate, async (req, res) => {
    const { old_password, new_password, confirm_password } = req.body;
    if (!old_password || !new_password || !confirm_password) {
      return res.status(400).json({ error: "filled the data" });
    }
    const batchadvisor = await BatchAdvisor.findById(req.rootuser);
    //  console.log("Refeded");
    const isMatched = await bcrypt.compare(old_password, batchadvisor.password);
    //  console.log("dhgafvasd");
    if (!isMatched) {
      return res.status(400).json({ error: "Old password is not Correct" });
    } else if (new_password != confirm_password) {
      return res.status(400).json({ error: "confirm password does not match" });
    }
    batchadvisor.password = new_password;
    await batchadvisor.save();
    //  sendToken(user, 200, res)
    res.status(200).send("Password updated successfully");
  });
//----------------------contact No-----------------------
  //update batch advisor contact number
router.put("/BA_updatecontact", BA_authenticate, async (req, res) => {
    const batchadvisor = await BatchAdvisor.findById(req.rootuser);
    // console.log("Refeded");
    try {
      batchadvisor.contactNo = req.body.contactNo;
      await batchadvisor.save();
      res.status(200).send("phone number updated successfully");
    } catch (error) {
      return res
        .status(400)
        .json({ error: "enter the number in correct format" });
    }
  });
//-----------------------------top menu----------------------
//topmenu of batchadvisor
router.get("/BA_Topmenu", BA_authenticate, async (req, res) => {
    console.log("get top menu");
    res.status(200).send(req.rootuser);
  });
//---------------------------BatchAdvisor logout----------------------
router.get("/Batchadvisorlogout",BA_authenticate, (req, res) => {
    res.clearCookie("Bjwtoken", { path: "/" });
    res.status(200).send("user logout");
  });
//-----------------------reset password email for batchadvisor-------------
router.post("/BA_sendresetemail", async (req, res) => {
    try {
      const { email } = req.body;
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          console.log(err);
        } else {
          const token = buffer.toString("hex");
          const batchadvisor = await BatchAdvisor.findOne({ email });
          console.log(batchadvisor);
          if (!batchadvisor) {
            return res.status(422).json({ error: "user does not found" });
          } else {
            batchadvisor.resettoken = token;
            batchadvisor.expiretoken = Date.now() + 3600000;
            await batchadvisor.save();
            //  console.log(batchadvisor);
            const to = batchadvisor.email;
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
                                   <h3 style="display: inline">${batchadvisor.name},</h3>
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
                                   ><a href="http://localhost:3000/NewBatchAdvisorPassword/${token}">
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
            //    <h5>link in this <a href="http://localhost:3000/NewBatchAdvisorPassword/${token}">link</a> to reset</h5>
            //   `
            //  }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
//-----------------------reset password for batchadvisor-------------------
router.put("/BA_resetpassword", async (req, res) => {
    try {
      const { new_password, confirm_password } = req.body;
      const sentToken = req.body.token;
      if (!new_password || !confirm_password) {
        return res.status(400).json({ error: "filled the data" });
      }
      if (new_password != confirm_password) {
        return res.status(400).json({ error: "confirm password does not match" });
      }
      console.log(new_password);
      const batchadvisor = await BatchAdvisor.findOne({
        resettoken: sentToken,
        expiretoken: { $gt: Date.now() },
      });
      //  console.log(user)
      if (!batchadvisor) {
        res.status(422).json({ error: "token expire" });
      }
      batchadvisor.password = new_password;
      batchadvisor.resettoken = undefined;
      batchadvisor.expiretoken = undefined;
      await batchadvisor.save();
      //  sendToken(user, 200, res)
      res.status(200).send("Password updated successfully");
    } catch (error) {
      console.log(error);
    }
  });
//----------------------home page  batch advisor------------------
//freeze requests
//drop pending request
router.get("/drop_pending", BA_authenticate, async (req, res) => {
    const batchadvisor = req.rootuser;
    const batch = batchadvisor.batch;
    const data1=await FreezeSemester.find({batch})
    const data = await CourseRequest.find({ batch });
    if (!data) {
      res.send("no record found");
    } else {
      const data2=data.concat(data1)
      res.send(data2);
    }
  });
  //drop course form on ok
  router.post("/dropcoursess", async (req, res) => {
    const { registrationId } = req.body;
    const data = await CourseRequest.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no record found");
    } else {
      const data1 = await Student.findOne({ registrationId });
      if (data.semester === 1) {
        for (var i = 0; i < data1.Result[0].Semester1.length; i++) {
          if (data1.Result[0].Semester1[i].status === "pending") {
            await data1.Result[0].Semester1.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 2) {
        for (var i = 0; i < data1.Result[0].Semester2.length; i++) {
          if (data1.Result[0].Semester2[i].status === "pending") {
            await data1.Result[0].Semester2.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 3) {
        for (var i = 0; i < data1.Result[0].Semester3.length; i++) {
          if (data1.Result[0].Semester3[i].status === "pending") {
            await data1.Result[0].Semester3.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 4) {
        for (var i = 0; i < data1.Result[0].Semester4.length; i++) {
          if (data1.Result[0].Semester4[i].status === "pending") {
            await data1.Result[0].Semester4.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 5) {
        for (var i = 0; i < data1.Result[0].Semester5.length; i++) {
          if (data1.Result[0].Semester5[i].status === "pending") {
            await data1.Result[0].Semester5.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 6) {
        for (var i = 0; i < data1.Result[0].Semester6.length; i++) {
          if (data1.Result[0].Semester6[i].status === "pending") {
            await data1.Result[0].Semester6.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 7) {
        for (var i = 0; i < data1.Result[0].Semester7.length; i++) {
          if (data1.Result[0].Semester7[i].status === "pending") {
            await data1.Result[0].Semester7.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      } else if (data.semester === 8) {
        for (var i = 0; i < data1.Result[0].Semester2.length; i++) {
          if (data1.Result[0].Semester2[i].status === "pending") {
            await data1.Result[0].Semester2.splice(i, 1);
          }
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      }
    }
    //ok kerna per is student ka from ma jitna record sab khatam aur student ma drop pendeing student sa deletee ho jai ho jai status
    //mailsend ho jai form k
  });
  //reject drop course
  router.delete("/delete_DropRequest", async (req, res) => {
    console.log(req.body.courseName)
    const { courseName, registrationId, } = req.body;
    const data = await CourseRequest.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no course found ");
    } else {
      // console.log(data.courses.length);
      for (var i = 0; i < data.courses.length; i++) {
        if (courseName === data.courses[i].courseName) {
          console.log(data.courses[i].courseName);
          // console.log("fef", i);
          await data.courses.splice(i, 1);
          await data.save()
          if(data.courses.length===0){
            await data.delete();
          }
          // await data.save();
          const data1 = await Student.findOne({ registrationId });
          console.log(data1);
          if (!data1) {
            res.status(400).send("no student found that request for drop course");
          } else {
            if (data.semester === 1) {
              for (var j = 0; j < data1.Result[0].Semester1.length; j++) {
                if (data1.Result[0].Semester1[j].courseName === courseName) {
                  // console.log(data1.Result[0].Semester1[j].status);
                  data1.Result[0].Semester1[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 2) {
              for (var j = 0; j < data1.Result[0].Semester2.length; j++) {
                if (data1.Result[0].Semester2[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester2[j].status);
                  data1.Result[0].Semester2[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 3) {
              for (var j = 0; j < data1.Result[0].Semester3.length; j++) {
                if (data1.Result[0].Semester3[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester3[j].status);
                  data1.Result[0].Semester3[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 4) {
              for (var j = 0; j < data1.Result[0].Semester4.length; j++) {
                if (data1.Result[0].Semester4[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester4[j].status);
                  data1.Result[0].Semester4[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 5) {
              for (var j = 0; j < data1.Result[0].Semester5.length; j++) {
                if (data1.Result[0].Semester5[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester5[j].status);
                  data1.Result[0].Semester5[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 6) {
              for (var j = 0; j < data1.Result[0].Semester6.length; j++) {
                if (data1.Result[0].Semester6[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester6[j].status);
                  data1.Result[0].Semester6[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 7) {
              for (var j = 0; j < data1.Result[0].Semester7.length; j++) {
                if (data1.Result[0].Semester7[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester7[j].status);
                  data1.Result[0].Semester7[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            } else if (data.semester === 8) {
              for (var j = 0; j < data1.Result[0].Semester8.length; j++) {
                if (data1.Result[0].Semester8[j].courseName === courseName) {
                  console.log(data1.Result[0].Semester8[j].status);
                  data1.Result[0].Semester8[j].status = "enrolled";
                  await data1.save();
                  res.send("deleted");
                }
              }
            }
          }
        }
      }
    }
  });
  //jis course ka deletee button per click kra delete ho jai
  //student ka schema ma sa bi ja ka update ker da
  
  //---------------------------------ADD DROP FORM-------------------
  router.get("/Add_Drop_Form/:registrationId",async (req,res) =>{
    try {
      const {registrationId}=req.params;
      const data= await CourseRequest.findOne({registrationId})
      if(!data){
        res.status(400).send("no record found");
      }else{
        res.status(200).send(data);
      }
      
    } catch (error) {
      console.log(error)
    }
    
  })
  //----------------------FREEZE FORM-------------------
  router.get("/Freeze_Form/:registrationId",async (req,res) =>{
    try {
      const {registrationId}=req.params;
      const data= await FreezeSemester.findOne({registrationId})
      if(!data){
        res.status(400).send("no record found");
      }else{
        res.status(200).send(data);
      }
      
    } catch (error) {
      console.log(error)
    }
    
  })
//studentsindormations
router.get("/StudentsInformations", BA_authenticate, async (req, res) => {
    try {
      const data = req.rootuser;
      console.log(data);
      const batch = data.batch;
      console.log(batch);
      const studentDetail = await Student.find({ batch: batch });
      if (!studentDetail) res.status(400).send("error");
      else {
        res.send(studentDetail);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });
  //get student result card
  router.get("/StudentResult/:_id", async (req, res) => {
    try {
      const data = await Student.findById(req.params._id);
  
      if (!data) {
        res.status(200).send("no record found");
      } else {
        res.status(200).send(data.Result[0]);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  });
  //view result
  router.get("/student_result", async (req, res) => {
    const { registrationId } = req.body;
    const data = await Student.findOne({ registrationId });
    if (!data) {
      res.send("no record found");
    } else {
      // const semester=data.semester;
      
      if (data.semester === 1) {
        const data1 = data.Result[0].Semester1;
        res.status(200).send(data1);
      } else if (data.semester === 2) {
        const data1 = data.Result[0].Semester1.concat(data.Result[0].Semester2);
        res.status(200).send(data1);
      } else if (data.semester === 3) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3
        );
        res.status(200).send(data1);
      } else if (data.semester === 4) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4
        );
        res.status(200).send(data1);
      } else if (data.semester === 5) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5
        );
        res.status(200).send(data1);
      } else if (data.semester === 6) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6
        );
        res.status(200).send(data1);
      } else if (data.semester === 7) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6,
          data.Result[0].Semester7
        );
        res.status(200).send(data1);
      } else if (data.semester === 8) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6,
          data.Result[0].Semester7,
          data.Result[0].Semester8
        );
        res.status(200).send(data1);
      } else if (data.semester === 9) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6,
          data.Result[0].Semester7,
          data.Result[0].Semester8,
          data.Result[0].Semester9
        );
        res.status(200).send(data1);
      } else if (data.semester === 10) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6,
          data.Result[0].Semester7,
          data.Result[0].Semester8,
          data.Result[0].Semester9,
          data.Result[0].Semester10
        );
        res.status(200).send(data1);
      } else if (data.semester === 11) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6,
          data.Result[0].Semester7,
          data.Result[0].Semester8,
          data.Result[0].Semester9,
          data.Result[0].Semester10,
          data.Result[0].Semester11
        );
        res.status(200).send(data1);
      } else if (data.semester === 12) {
        const data1 = data.Result[0].Semester1.concat(
          data.Result[0].Semester2,
          data.Result[0].Semester3,
          data.Result[0].Semester4,
          data.Result[0].Semester5,
          data.Result[0].Semester6,
          data.Result[0].Semester7,
          data.Result[0].Semester8,
          data.Result[0].Semester9,
          data.Result[0].Semester10,
          data.Result[0].Semester11,
          data.Result[0].Semester12
        );
        res.status(200).send(data1);
      }
    }
  });

  module.exports = router;