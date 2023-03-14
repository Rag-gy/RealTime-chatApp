const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({id}, THisisMadnESsasItRYtoCReAteTHis, {expiresIn:'30d'})    // this will create a secret key which expires in 30 days
}

module.exports = generateToken;
