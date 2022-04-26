// name,regId,section,email,cgpa,phone,address,course(code,title,credith),reason
const mongoose = require("mongoose")
const addrequestSchema = mongoose.Schema({
    batch:{
        type: String,
        required:true
    },
    registrationId:{
        type: String,
        required:true,        
    },
    semester: {
        type: Number,
        required:true,
    },
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    CGPA: {
        type: Number,
        required: true 
    },
    request:{
        type:String,
        required:true,
        default:"Add Pending"
    },
    section:{
        type:String,
        required:true
    },
    fee:{
        type:String,
        required:true
    },
    // courses:[{
    //     courseCode:{
    //         type:String,
    //         required:true
    //     },
    //     courseName:{
    //         type:String,
    //         required:true,
    //     },
    //     credits:{
    //         type:String,
    //         required:true
    //     },
    //     Section_to:{
    //         type:String,
    //         required:true
    //     }
    // }],
})

//add drop requests
// addrequestSchema.methods.add_course = async function(courseName,courseCode,credits,Section_to) {
//     try {
//         this.courses = this.courses.concat({courseName:courseName,courseCode:courseCode,credits:credits,Section_to:Section_to})
//         await this.save();
//         return this.courses;
//     } catch (error) {
//         console.log(error);
//     }
// }
//create the collection in database
const Addcourse = mongoose.model("Addcourse", addrequestSchema);
module.exports = Addcourse;