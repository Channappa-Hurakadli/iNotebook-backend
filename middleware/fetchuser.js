const jwt = require('jsonwebtoken');
const jwtSec = 'thisIsASecretString';

const fetchuser= (req,res,next)=>{
    //Get the user from jwt and id to the req object
    const token = req.header('authToken'); 
    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }
    try {
        const data = jwt.verify(token,jwtSec);
        req.user=data.user;
        next();
    } catch (error) {
        console.error(error.message); 
        res.status(401).send({ message: "Access denied. No token provided." });
    }

}

module.exports = fetchuser;

