const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) =>{

    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' });
     const token = req.headers.authorization.split(' ')[1]; 
     console.log("Token:", token);

    if(!authorization){
        return res.status(401).json({error: 'Token is not found'});
    }

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decode
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}


const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};