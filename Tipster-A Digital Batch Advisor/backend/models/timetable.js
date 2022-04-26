const mongoose = require("mongoose")
const timetableschema = new mongoose.Schema({
    batch: {
        type: String,
        require: true
    },
    degree: {
        type: String,
        require: true
    },
    section: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require:true
    }

})
//create the collection in database
const Timetable = mongoose.model("Timetable", timetableschema);
module.exports = Timetable;
