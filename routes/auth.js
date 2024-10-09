const express=require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const jwtSec = 'thisIsASecretString';

//create a user using POST /api/auth/createuser ... no login required

router.post('/createuser',[                               

    //validating the input info field (field,error-msg)

    body('name','Enter the valid name').isLength({min:3}),
    body('email','Enter the valid email id').isEmail(),
    body('password','Password must be min 4 characters').isLength({min:4}),

],async (req,res)=>{

    // if there are errors return the error and 'bad request'
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({errors:result.array()});
    }

    //check whether the mail already exists or not
    try{
    let user =await  User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({error:"Sorry the user with this email already exists"})
    }

    //generating the salt 
    const salt = await bcrypt.genSalt(10);

    //hashing the password and adding the salt
    const secPass = await bcrypt.hash(req.body.password,salt);

    //creating the user
  user = await User.create({
    name: req.body.name,
    email:req.body.email,
    password: secPass,
  })

  const data = {
    user: user.id,
  }

  const authToken = jwt.sign(data,jwtSec);
  res.json({authToken});

  // res.json(user)

  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//Authenticate a user using POST /api/auth/login ... no login required

router.post('/login',[                               

  //validating the input info field (field,error-msg)

  body('email','Enter the valid email id').isEmail(),
  body('password','Password must be min 4 characters').isLength({min:4}),

],async (req,res)=>{

    // if there are errors return the error and 'bad request'
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({errors:result.array()});
    }

    const {password,email}=req.body;  //destructuring the user object 
    try {
      let user = await User.findOne({email});   // finding the entered email from database
      if(!user){
        return res.status(400).json({error:"Please enter the proper credentials"})    //return error if not found
      } 
    const passwordCheck = await bcrypt.compare(password,user.password);     // comparing the entered password and userPassword
    if(!passwordCheck){
      return res.status(400).json({error:"Please enter the proper credentials"})    //if not match return with error
    }

    const data = {
      user: user.id,
    }
  
    const authToken = jwt.sign(data,jwtSec);
    res.json({authToken});
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }

})
module.exports = router;