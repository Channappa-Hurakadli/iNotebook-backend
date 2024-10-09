const express=require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//create a user using POST /api/auth/createuser ... no login required

router.post('/createuser',[
    body('name','Enter the valid name').isLength({min:3}),
    body('email','Enter the valid email id').isEmail(),
    body('password','Password must be min 4 characters').isLength({min:4}),

],async (req,res)=>{
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

  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  res.json(user)
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
})
module.exports = router;