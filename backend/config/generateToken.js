const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.SECRET_KEY, {expiresIn:'30d'})    // this will create a secret key which expires in 30 days
}

module.exports = generateToken;