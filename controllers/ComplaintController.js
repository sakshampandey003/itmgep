const ComplaintModel = require('../models/Complaint')
const cloudinary = require("cloudinary").v2;
const nodemailer = require('nodemailer')


cloudinary.config({
  cloud_name: "dbdag1blc",
  api_key: "981943824214143",
  api_secret: "Hf5F9FfHFBxdjMEXydLlhCGhP2w",
});
class ComplaintController{

   static addcomplaint = async(req,res)=>{
    try{
        const{name, email, role, image,id}=req.data1
        const cdata = await ComplaintModel.find({user_id:id})
        res.render('complaint/addcomplaint',{ c:cdata,n:name, role:role,img:image })
    }catch(error){
        console.log(error)
    }
}
static complaintinsert = async (req, res) => {
    try {
        const { name, email, role, image, id } = req.data1
        // console.log(req.body)
        // console.log(req.files.image)
        const { ctype, semester, subject, cdetail, user_id } = req.body
        const complaint = await ComplaintModel.findById(id)
        // console.log(id)
        const file = req.files.image
        const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'Profile Image'
        })
        const result = new ComplaintModel({
            name: name,
            email: email,
            ctype: ctype,
            cdetail: cdetail,
            semester: semester,
            subject: subject,
            user_id: id,
            image: {
                public_id: image_upload.public_id,
                url: image_upload.secure_url,
            }
        })
        await result.save()
        this.sendEmail1(name,email,ctype)
        res.redirect('/addcomplaint')
    } catch (error) {
        console.log(error)
    }
}

static complaintview = async (req, res) => {
    try {
        const { name, email, role, image } = req.data1
        // console.log(req.params.id)
        const cdata = await ComplaintModel.findById(req.params.id)
        // console.log(data)
        res.render('complaint/view', { c: cdata, n: name, role: role, img: image })
    } catch (error) {
        console.log(error)
    }
}   

static complaintedit = async (req, res) => {
    try {
        const { name, email, role, image } = req.data1
        // console.log(req.params.id)
        const cdata = await ComplaintModel.findById(req.params.id)
        // console.log(data)
        res.render('complaint/edit', { c: cdata, n: name, role: role, img: image })
    } catch (error) {
        console.log(error)
    }
}

static complaintdelete = async (req, res) => {
    try {
        const { name, email } = req.data1
        // console.log(req.params.id)
        const cdata = await ComplaintModel.findByIdAndDelete(req.params.id)
        // console.log(data)
        res.redirect('/addcomplaint')
    } catch (error) {
        console.log(error)
    }
}
static updatestatus = async (req,res) =>{
    try {
      const {name, email, comment, status} = req.body
      // console.log(req.body)
      await ComplaintModel.findByIdAndUpdate(req.params.id,{
        comment:comment,
        status:status
      })
      this.sendEmail(name,email,comment,email)
      res.redirect('/displaycomplaint')
    } catch (error) {
      console.log(error)
    }
  }

  static sendEmail = async(name, email, comment, status)=> {
    //console.log("email sending")
    //console.log("propertyName")
    // console.log(name,email,comment,status)

    // connect with the smtp server

    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,

        auth: {
            user: "sakshamp657@gmail.com",
            pass: "qdly fsar cdhw kunr",
        },
    });
    let info = await transporter.sendMail({
        from:"test@gmail.com", //sender address
        to: email, //list of receivers
        subject: `Complaint ${status}Succesfully`, //Subject line
        text: "hello", //plain text body
        html: `<b>${name}</b> Complaint <b>${status}</b> successfull! complaint ${comment}`, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

static sendEmail1 = async(name, email, ctype)=> {


    //console.log("email sending")
    //console.log("propertyName")
    console.log(name,email,ctype)

    // connect with the smtp server

    let transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,

        auth: {
            user: "sakshamp657@gmail.com",
            pass: "qdly fsar cdhw kunr",
        },
    });
    let info = await transporter.sendMail({
        from:"test@gmail.com", //sender address
        to: email, //list of receivers
        subject: `Complaints Send Succesfully`, //Subject line
        text: "hello", //plain text body
        html: `<b>${name}</b> Complaint <b>${ctype}</b> successfull! Please wait`, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

}







module.exports = ComplaintController