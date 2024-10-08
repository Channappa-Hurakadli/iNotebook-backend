const express=require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//create a user using POST /api/auth

router.post('/',[
    body('name','Enter the valid name').isLength({min:3}),
    body('email','Enter the valid email id').isEmail(),
    body('password','Password must be min 4 characters').isLength({min:4}),

],(req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({errors:result.array()});
    }
    // res.send({ errors: result.array() });

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }).then(user => res.json(user))
  .catch(err => console.log(err));

})
module.exports = router;