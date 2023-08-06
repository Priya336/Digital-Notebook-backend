const mongoose= require('mongoose');
const mongoURI="mongodb://0.0.0.0:27017/inotebook"

const connectToMongo=()=>{
    mongoose.connect(mongoURI)
    .then((console.log("connection To Moongose Successfully"))) 
    .catch((err)=>(console.log(err)))
}
module.exports=connectToMongo;   