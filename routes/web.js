const express = require('express')
const FrontController = require("../controllers/FrontController")
const TeacherController = require("../controllers/TeacherController")
const AdminController = require("../controllers/admin/admincontroller")
const StudentController = require('../controllers/admin/StudentController')
const route = express.Router()
const checkauth = require('../middlewear/auth')
const ComplaintController = require('../controllers/ComplaintController')
const CourseController = require('../controllers/admin/CourseController')

//routing
route.get('/',FrontController.home)
route.get('/about',FrontController.about)
route.get('/gri',FrontController.gri)
route.get('/features',FrontController.features)
route.get('/contact',FrontController.contact)
route.get('/login',FrontController.login)
route.get('/benefits',FrontController.benefits)
route.get('/help',FrontController.help)

//TecherController
route.get('/teacher/display',TeacherController.displayTeacher)

//admin controllera
route.get('/admin/dashboard',checkauth,AdminController.dashboard)
route.get('/admin/login',AdminController.login)
route.get('/admin/registration',AdminController.registration)
route.post('/admininsert',AdminController.admininsert)
route.get('/displaycomplaint',checkauth,AdminController.complaintdisplay)
//  route.post('/admin/verifylogin',AdminController.verifylogin)


//student croute.get('/admin/addstudent',StudentController.addstudent)
route.get('/admin/addstudent',checkauth,StudentController.addstudent)
route.post('/studentinsert',checkauth,StudentController.studentinsert)
route.get('/admin/studentview/:id',checkauth,StudentController.viewstudent)
route.get('/admin/studentedit/:id',checkauth,StudentController.editstudent)
route.post('/admin/studentupdate/:id',checkauth,StudentController.updatestudent)
route.get('/admin/studentdelete/:id',StudentController.deletestudent)
route.post('/verifylogin',StudentController.verifylogin)
route.get('/changepassword',checkauth,StudentController.changepassword)
route.post('/updatepassword',checkauth,StudentController.updatepassword)
route.get('/profile',checkauth,StudentController.profile)
route.post('/updateprofile',checkauth,StudentController.updateprofile)
route.get('/logout',StudentController.logout)
 
//complaintController
route.get('/addcomplaint',checkauth,ComplaintController.addcomplaint)
route.post('/complaintinsert',checkauth,ComplaintController.complaintinsert)
route.get('/complaint/complaintview/:id',checkauth,ComplaintController.complaintview)
route.get('/complaint/complaintedit/:id',checkauth,ComplaintController.complaintedit)
route.get('/complaint/complaintdelete/:id',checkauth,ComplaintController.complaintdelete)
route.post('/updatestatus/:id',checkauth,ComplaintController.updatestatus)

// course controller
route.get('/addcourse',checkauth,CourseController.addcourse)
route.post('/courseinsert',checkauth,CourseController.courseinsert)
route.get('/course/courseview/:id',checkauth,CourseController.courseview)
route.get('/course/courseedit/:id',checkauth,CourseController.courseedit)
route.get('/course/coursedelete/:id',checkauth,CourseController.coursedelete)
// route.post('/course/courseupdate/:id',checkauth,CourseController.courseupdate)


module.exports = route
