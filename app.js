const express = require('express');
const app = express();
const cors = require("cors");
const db = require('./db')
const port = process.env.PORT||8000;
const authController = require("./controller/authController");

app.use('/api/auth',authController);
app.use(cors());

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})