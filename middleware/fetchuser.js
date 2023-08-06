const jwt = require('jsonwebtoken')
const JWT_SECRET ='priyaisagoodgirl'
const fetchuser = (req, res, next) => {
    //GET the user from jwt token add id to req object 
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authtecate using valid token " })
       
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
         req.user = data.user;
        next();
    } catch (error) {
        res.status(421).send({ error: "please authenticate using valid token " })
    }
}
module.exports = fetchuser