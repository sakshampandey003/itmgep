const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    cname:{
        type:String,
        required:true,
    }
    

})

// for make model
const CourseModel=mongoose.model('Course',CourseSchema)
module.exports = CourseModel