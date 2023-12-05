const StudentModel = require("../../models/Student");
const bcrypt = require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const CourseModel = require('../../models/Course')
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbdag1blc",
  api_key: "981943824214143",
  api_secret: "Hf5F9FfHFBxdjMEXydLlhCGhP2w",
});
class StudentController {
  static addstudent = async (req, res) => {
    try {
      const { name, email, role, image } = req.data1;
      const data = await StudentModel.find().sort({ _id: -1 });
      const course = await CourseModel.find()
      // console.log(data)
      res.render("admin/student/addstudent", {
        d: data,
        n: name,
        role: role,
        img: image,
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static studentinsert = async (req, res) => {
    try {
      // console.log(req.files.image)
      const file = req.files.image;
      const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "fileImage",
      });
      // console.log(image_upload)
      // console.log(req.body)

      const { name, email, password } = req.body;
      const student = await StudentModel.findOne({ email: email });
      if (student) {
        req.flash("error", "email already exist");
        req.redirect("/admin/addstudent");
      } else {
        if (name && email && password) {
          const hashpassword = await bcrypt.hash(password, 10);
          const r = new StudentModel({
            name: name,
            email: email,
            password: hashpassword,
            image: {
              public_id: image_upload.public_id,
              url: image_upload.secure_url,
            },
          });
          await r.save();
          req.flash("success", "student insert successfully");
          res.redirect("/admin/addstudent");
        } else {
          req.flash("error", "all fields are required");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  static viewstudent = async (req, res) => {
    try {
      const { name, email, role, image } = req.data1;
      // console.log(req.params.id)
      const data = await StudentModel.findById(req.params.id);
      res.render("admin/student/view", {
        d: data,
        n: name,
        role: role,
        img: image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static editstudent = async (req, res) => {
    try {
      const { name, email, role, image } = req.data1;
      //console.log(req.params.id)
      const data = await StudentModel.findById(req.params.id);
      res.render("admin/student/edit", {
        d: data,
        n: name,
        role: role,
        img: image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static updatestudent = async (req, res) => {
    try {
      //console.log(req.body)
      //   console.log(req.files.image)
      const { name, email, password } = req.body;
      const hashpassword = await bcrypt.hash(password, 10);
      if (req.files) {
        const student = await StudentModel.findById(req.params.id);
        const imageid = student.image.public_id;
        // console.log(imageid)
        await cloudinary.uploader.destroy(imageid);
        const file = req.files.image;
        const image_upload = await cloudinary.uploader.upload(file.tempFilePath,{
            folder: 'fileImage'
          });
        var data = {
          name: name,
          email: email,
          password: hashpassword,
          image: {
            public_id: image_upload.public_id,
            url: image_upload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
          password: hashpassword,
        };
      }
      const id = req.params.id;
      const update = await StudentModel.findByIdAndUpdate(id, data);
      req.flash("success", "updates successfully");

      res.redirect("/admin/addstudent");
    } catch (error) {
      console.log(error);
    }
  };

  static deletestudent = async (req, res) => {
    try {
      await StudentModel.findByIdAndDelete(req.params.id);
      res.redirect("/admin/addstudent");
    } catch (error) {
      console.log(error);
    }
  };


  static verifylogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await StudentModel.findOne({ email: email });
        //console.log(student);
        if (user != null) {
          const ismatched = await bcrypt.compare(password, user.password);
          if (ismatched) {
            if (user.role == "admin") {
              const token = jwt.sign({ ID: user._id }, "saksham@1234");
              // console.log(token)
              // For cookies
              res.cookie("token", token);
              res.redirect("/admin/dashboard");
            }
            if (user.role == "student") {
              const token = jwt.sign({ ID: user._id }, "saksham@1234");
              // console.log(token)
              // For cookies
              res.cookie("token", token);
              res.redirect("/admin/dashboard");
            }
            // Genrate token for login security
          } else {
            res.redirect("/");
          }
        } else {
          res.redirect("/");
        }
      } else {
        res.redirect("/");
      }
      // console.log(req.body);
    } catch (error) {
      console.log(error);
    }
  };

  static changepassword = async (req, res) => {
    try {
      const { name, email, role,image } = req.data1;
      res.render("admin/student/changepassword", {
        n: name,
        role: role,
        img: image,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static updatepassword = async (req, res) => {
    try {
      const { name, email, id } = req.data1;
      const { oldpassword, newpassword, cpassword } = req.body;
      if (oldpassword && newpassword && cpassword) {
        const user = await StudentModel.findById(id);
        const ismatched = await bcrypt.compare(oldpassword, user.password);
        if (!ismatched) {
          req.flash("error", "oldpassword is incorrect");
          res.redirect("/changepassword");
        } else {
          if (newpassword != cpassword) {
            req.flash("error", "newpassword and cpassword is notmatched");
            res.redirect("/changepassword");
          } else {
            const newhashpassword = await bcrypt.hash(newpassword, 10);
            const result = await StudentModel.findByIdAndUpdate(id, {
              password: newhashpassword,
            });
            req.flash("success", "password update successfully");
            res.redirect("/changepassword");
          }
        }
        // console.log(user)
      } else {
        req.flash("error", "all field are required");
        res.redirect("/changepassword");
      }

      //    console.log(req.body)
    } catch (error) {
      console.log(error);
    }
  };

  static profile = async (req, res) => {
    try {
      const { name, email, phone, address, city, role, image,course } = req.data1;
      res.render("admin/student/profile", {
        n: name,
        e: email,
        p: phone,
        c: city,
        a: address,
        role: role,
        img: image,
        co:course,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static updateprofile = async (req, res) => {
    try {
      // For Name On Dash
      const { name, email, id } = req.data1;
      //    console.log(req.body)
      //  console.log(req.files.image)
      if (req.files) {
        const student = await StudentModel.findById(id);
        const imageid = student.image.public_id;
        // console.log(imageid)
        await cloudinary.uploader.destroy(imageid);
        const file = req.files.image;
        const image_upload = await cloudinary.uploader.upload(
          file.tempFilePath,({
            folder: "fileImage",
          })
        );
        var data = {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          address: req.body.address,
          image: {
            public_id: image_upload.public_id,
            url: image_upload.secure_url,
          },
        };
      } else {
        var data = {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          address: req.body.address,
        };
      }
      // const id = req.params.id
      const update = await StudentModel.findByIdAndUpdate(id, data);
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

// class StudentController {
//     static addstudent = async (req,res) => {
//         try {
//             const{name,email} = req.data1
//             const data = await StudentModel.find().sort({ _id: -1 })
//             // console.log(data)
//             res.render('admin/student/addstudent', { d: data, n:name })
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     static studentinsert = async (req, res) => {
//         try {
//             // console.log(req.body)
//             const { name, email, password } = req.body
//             const hashpassword = await bcrypt.hash(password, 10)
//             const r = new StudentModel({
//                 name: name,
//                 email: email,
//                 password: hashpassword

//             })
//             await r.save()
//             res.redirect('/admin/addstudent')
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     static viewstudent = async (req,res) => {
//         try {
//             const{name,email} = req.data1
//             // console.log(req.params.id)
//             const data = await StudentModel.findById(req.params.id)
//             //console.log(data);
//             res.render('admin/student/view', { d: data, n:name })
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     static editstudent = async (req,res) => {
//         try {
//             const{name,email} = req.data1
//             //console.log(req.params.id)
//              const data = await StudentModel.findById(req.params.id)
//            // console.log(data);
//              res.render('admin/student/edit',{ d: data, n:name })
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     static updatestudent = async (req,res)=>{
//         try{
//             //console.log(req.body);
//             const id = req.params.id
//             const update  = await StudentModel.findByIdAndUpdate(id,{
//                 name:req.body.name,
//                 email : req.body.email,
//                 password:req.body.password
//             })
//             res.redirect('/admin/addstudent')
//         }catch(error){
//             console.log(error);
//         }
//     }
//     static studentdelete = async (req,res)=>{
//         try{
//          await StudentModel.findByIdAndDelete(req.params.id)
//          res.redirect('/admin/addstudent')
//         }catch(error){
//             console.log(error);
//         }
//     }
//     static verifylogin = async (req,res)=>{
//         try{
//             const{email,password} = req.body
//             if(email && password) {
//                 const user = await StudentModel.findOne({email:email})
//                 //console.log(student);
//                 if( user != null){
//                     const ismatched = await bcrypt.compare(password,user.password)
//                     if(ismatched) {
//                         if(user.role == 'admin'){
//                             const token = jwt.sign({ ID: user._id }, 'saksham@1234');
//                             // console.log(token)
//                             // For cookies
//                             res.cookie('token',token)
//                             res.redirect('/dashboard')
//                         }
//                         if(user.role == 'student'){
//                             const token = jwt.sign({ ID: user._id }, 'saksham');
//                             // console.log(token)
//                             // For cookies
//                             res.cookie('token',token)
//                             res.redirect('/dashboard')
//                         }
//                         // Genrate token for login security

//                     }else{
//                         res.redirect('/')
//                        }
//                 }else{
//                     res.redirect('/')
//                 }
//             }else{
//                 res.redirect('/')
//             }
//             // console.log(req.body);
//         }catch(error) {
//             console.log(error);
//         }
//     }
//     static profile = async (req,res)=>{
//         try{
//                // For Name On Dash
//                const{name,email,phone,city,address} = req.data1
//                res.render('admin/student/profile',{n:name,e:email,p:phone,c:city,a:address})
//         }catch(error){
//             console.log(error)
//         }
//     }
//     static updateprofile = async (req,res)=>{
//         try{
//                // For Name On Dash
//                const{name,email,id} = req.data1
//             //    console.log(req.body)
//             const update  = await StudentModel.findByIdAndUpdate(id,{
//                 name:req.body.name,
//                 email : req.body.email,
//                 password:req.body.password,
//                 phone:req.body.phone,
//                 city:req.body.city,
//                 address:req.body.address
//             })
//             res.redirect('/profile')

//         }catch(error){
//             console.log(error)
//         }
//     }
//     static changepassword = async (req,res)=>{
//         try{
//             // For Name On Dash
//             const{name,email} = req.data1
//             res.render('admin/student/changepassword',{n:name,msg:req.flash('error'),msg1:req.flash('success')})
//         }catch(error){
//             console.log(error)
//         }
//     }
//     static updatepassword = async (req,res)=>{
//         try{
//             // console.log(req.body)
//             const{name,email,id} = req.data1
//             // for passcheck
//             const{oldpassword,newpassword,cpassword} = req.body
//             if(oldpassword && newpassword && cpassword){
//                 const user = await StudentModel.findById(id)
//                 //console.log(user)
//                 // for password compare
//                 const ismatched = await bcrypt.compare(oldpassword,user.password)
//                 if (!ismatched){
//                     req.flash('error','Old Password is incorrect') // for msg
//                     res.redirect('/changepassword')
//                 }else{
//                     if(newpassword != cpassword){
//                         req.flash('error','newpssword and confirmpassword does not matched ') // for msg
//                         res.redirect('/changepassword')
//                     }else{
//                         const newhashpassword = await bcrypt.hash(newpassword,10)
//                         const r = await StudentModel.findByIdAndUpdate(id,{
//                             password:newhashpassword,

//                         })
//                         req.flash('success','Password update sucessfully ') // for msg
//                         res.redirect('/changepassword')

//                     }
//                 }
//             }else{
//                 req.flash('error','All Fields Are Required') // For msg
//                 res.redirect('/changepassword')
//             }
//         }catch(error){
//             console.log(error)
//         }
//     }
//     static logout = async (req,res)=>{
//         try{
//             res.clearCookie("token")
//             res.redirect('/')

//         }catch(error){
//             console.log(error)
//         }
//     }

// }
module.exports = StudentController;
