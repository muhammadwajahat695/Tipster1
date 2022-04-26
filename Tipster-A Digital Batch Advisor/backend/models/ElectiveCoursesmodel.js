const mongoose = require("mongoose")
const electiveCourseSchema = mongoose.Schema({
        courseCode:{
            type:String,
            required:true
        },
        courseName:{
            type:String,
            required:true
        },
        track:{
            type:Number,
            required:true,
            enum:[1,2,3]
        },
        credits:{
            type:Number,
            required:true,
            enum:[3,4]
        },
        prerequisite:[{
          course1:{
            type:String,
            default:"N/A"
          },
          course2:{
            type:String,
          } 
        }],

})

//create the collection in database
const ElectiveCourse = mongoose.model("ElectiveCourse", electiveCourseSchema);
module.exports = ElectiveCourse;