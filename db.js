const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/jwtlogin"
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology: true})