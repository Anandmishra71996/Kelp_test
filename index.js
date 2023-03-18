require('dotenv').config();
const express=require('express')
const multer= require('multer')
const {updateRecord}=require('./models/userController')
const app = express();
const PORT= process.env.PORT||4000;
app.listen(PORT,()=>{
  console.log(`Listining on ${process.env.PORT||4000}`)
},)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'json/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});


const upload = multer({ storage });
app.post("/insertUserData", upload.single('csvFile'),updateRecord);
app.get("/insertDatafromEnv",updateRecord);
