const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const batchAdvisorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter name"],
        maxLength: [30, "Name should not exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        maxLength: [30, "Email should not exceed 30 characters"]
    },
    contactNo: {
        type: String,
        required: [true, "Please enter contact no"],
        maxLength: [11, "Contact number should contain 11 digits"],
        minLength: [11, "Contact number should contain 11 digits"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        // maxLength: [12, "Password should contain minimum 8 and maximum 12 characters"],
        // minLength: [8, "Password should contain minimum 8 and maximum 12 characters"],
    },
    batch:{
        type:String,
        required: [true, "Please enter batch"],
        maxLength: [4, "Batch should be 4 characters long"],
        minLength: [4, "Batch should be 4 characters long"],
    },
    resettoken: {
        type: String
    },
    expiretoken: {
        type: Date
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now

    }
})

// //hashing the password

batchAdvisorSchema.pre("save", async function(next) {
    console.log("password hashed");
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

//generating the token

batchAdvisorSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

//create the collection in database
const BatchAdvisor = mongoose.model("BatchAdvisor", batchAdvisorSchema);
module.exports = BatchAdvisor;