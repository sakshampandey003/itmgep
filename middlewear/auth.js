 const jwt = require('jsonwebtoken')
 const StudentModel = require('../models/Student')


 const checkauth = async (req, res, next) => {
   // console.log('hello middleware')
//     //token get
        const{token}=req.cookies 
    // console.log(token)
    if (!token) {
        res.redirect('/')
    } else {
        const verifytoken = jwt.verify(token,'saksham@1234')
        // console.log(verifytoken)
        //for user data show
        const data = await StudentModel.findOne({_id:verifytoken.ID})
        // console.log(data)
        req.data1=data
        next()
    }
 }

 module.exports = checkauth