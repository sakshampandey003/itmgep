const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
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
    role:{
        type:String,
        default:'admin'
    }
})

// for make model
const AdminModel=mongoose.model('admin',AdminSchema)
module.exports=AdminModel