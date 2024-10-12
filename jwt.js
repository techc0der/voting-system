const jwt = require('jsonwebtoken');
//require('dotenv').config();

const verifyToken = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' });

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try{
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.key);
        console.log(decoded);
        // Attach user information to the request object
        req.user = decoded
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid tokens' });
    }
}


// Function to generate JWT token
const tokenGenerater = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.key, {expiresIn: 30000000});
}
module.exports = {
    verifyToken,tokenGenerater
};