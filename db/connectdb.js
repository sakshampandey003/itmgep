const mongoose=require('mongoose')

const connectdb = ()=>{
    return mongoose.connect('mongodb+srv://123:123@cluster0.xdvejqk.mongodb.net/')
    .then(()=>{
        console.log('connection succesfully')

    }).catch((error)=>{
        console.log(error)     
    })
}

module.exports= connectdb