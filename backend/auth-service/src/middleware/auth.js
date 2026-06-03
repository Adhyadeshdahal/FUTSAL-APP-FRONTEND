const jwt = require("jsonwebtoken");
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../../.env') });
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.join(__dirname, '../../config');
const config = require('config');

function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied.No token provided');
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY || config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send(`Invalid token.${ex}`);
    }
}

module.exports = auth;
