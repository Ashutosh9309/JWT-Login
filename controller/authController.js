const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const config = require('../config');

router.use(express.urlencoded({extended:true}));
router.use(express.json())

router.get('/users',(req,res)=>{
    const token = req.headers['x-access-token']
    if(token){
    User.find({},(err, result)=>{
        if(err) throw err;
        return res.send(result)
    })
}else{
    return res.send("please login")
}
})

router.post('/register',(req,res)=>{
    const hashedPassword = bcrypt.hashSync(req.body.password,8);
    const hashedConfirmPassword = bcrypt.hashSync(req.body.confirm_password,8);
    const user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirm_password:req.body.confirm_password,
        role:req.body.role?req.body.role:"user"
    }
    User.findOne({email:user.email},(err, result)=>{
        if(result){
            return res.send('User already exists!Please Login')
        }else{
                if(user.password==user.confirm_password){
                    user.password=hashedPassword;
                    user.confirm_password=hashedConfirmPassword
                User.create(user,(err, result)=>{
                    if(err) throw err;
                    return res.send("Registeration succesful")
                })
                }else{
                    return res.send("Please enter same password")
                }
        }

    })
})



router.post('/login',(req,res)=>{
    User.findOne({email:req.body.email},(err, result)=>{
        if(err) throw err;
        if(!result){
            return res.status(500).send("User does not exist!Please Login")
        }else{
            const validPassword = bcrypt.compareSync(req.body.password,result.password);
            if(!validPassword){
                return res.status(500).send("Please enter a valid password");
            }else{
                const token = jwt.sign({id:result._id},config.secrete,{expiresIn:86400})
                return res.send({auth:true,token:token})
            }
        }
    })

})

router.get('/userInfo',(req,res)=>{
    const token = req.headers['x-access-token']
    if(!token) return res.send({auth:false, "error":"No token provided"});
    jwt.verify(token,config.secrete,(err,result)=>{
        if(err) return res.status(500).send({auth:false, "error":"Invalid token"})
        User.findOne({_id:result.id},{password:0,confirm_password:0},(err,result)=>{
            res.send(result)
        })
    })
})

module.exports = router