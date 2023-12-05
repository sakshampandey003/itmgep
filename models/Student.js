const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    city:{
        type:String,
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
    },
    image:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    role:{
        type:String,
        default:'student',
    }
})

// for make model
const StudentModel=mongoose.model('student',StudentSchema)
module.exports = StudentModel