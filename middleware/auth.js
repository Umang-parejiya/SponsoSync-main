const jwt = require('jsonwebtoken');
const Sponser = require('../Model/sponser');
const User = require('../Model/user');
const Admin = require('../Model/admin');
require('dotenv').config();



module.exports.isSponserOwner = async(req,res,next)=>{
    try{
        const id = req.params.id;
        const sponser = await Sponser.findById(id);

        if(!sponser){
            res.status(404).json({error : 'Sponser not found'});
            return;
        }

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token id:", decoded.id); // For debugging purposes
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
       
        if(sponser.createdBy.toString() !== decoded.id.toString()){
            return res.status(401).json({error : 'Unauthorized'});
        }
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({error : 'Internal Server Error'});
        return;
    }
}




module.exports.isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("Token not provided or incorrect format.");
            return res.status(401).json({ error: 'Access Denied. Invalid token format.' });
        }

        const token = authHeader.split(' ')[1]; // Extract actual token
        console.log("Extracted Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const admin = await Admin.findById(decoded.id);
        if (!admin || !admin.isAdmin) {
            console.error("User is not admin or does not exist.");
            return res.status(403).json({ error: 'Access Denied. Admins only.' });
        }

        req.user = admin;
        next();
    } catch (err) {
        console.error("Error in isAdmin middleware:", err);
        res.status(500).json({ error: 'Internal Server Error at middleware' });
    }
};