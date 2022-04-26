const mongoose = require("mongoose")
const SchemeofStudySchema = mongoose.Schema({
        courseCode:{
            type:String,
            required:true
        },
        courseName:{
            type:String,
            required:true
        },
        semester:{
            type:Number,
            required:true,
            enum:[1,2,3,4,5,6,7,8]
        },
        credits:{
            type:Number,
            required:true,
            enum:[2,3,4]
        },
        prerequisite:[{
          course1:{
            type:String,
            required:true,
            default:"N/A"
          },
          course2:{
            type:String,

          },
          course3:{
            type:String,

          },
          course4:{
            type:String,
          }
        }],

})

//create the collection in database
const SOS = mongoose.model("SOS", SchemeofStudySchema);
module.exports = SOS;