const express = require('express')
// console.log(express)
const app = express()
const port = 3000
const web = require('./routes/web')
const connectdb=require('./db/connectdb')
const cookieparser = require('cookie-parser')
const fileUpload = require("express-fileupload");//for file upload



// for file upload
app.use(fileUpload({useTempFiles: true}));

 // cookies
 app.use(cookieparser())
 
// view engine ejs
app.set('view engine', 'ejs')

//css and images
app.use(express.static('public'))

//for show message
let session = require('express-session')
let flash = require('connect-flash');


app.use(session({
  secret: 'secret',
  cookie: {maxAge:60000},
  resave: false,
  saveUninitialized: false,

}));

app.use(flash());

//dbconnection
connectdb()

//for data get
app.use(express.urlencoded({extended:true}))

// routing load
 app.use('/',web)



//server creat
app.listen(port, () => {
    console.log(`server is running localhost:${port}`)
  })

  