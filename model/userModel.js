const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    confirm_password:String,
    role:String
})

mongoose.model('user',userSchema);
module.exports = mongoose.model('user');