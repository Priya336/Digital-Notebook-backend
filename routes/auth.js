const express = require('express');
const User = require('../Modules/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET ='priyaisagoodgirl'
const fetchuser=require('../middleware/fetchuser')
//Route1:Create a user using POST "/api/auth".Doesn't required Auth
router.post('/', [
  body('password', "Enter password of size 6").isLength({ min: 6 }),
  body('email', "Enter valid email").isEmail(),
  body('name', "Enter the valid name").isLength({ min: 5 })

], async (req, res) => {
  let success=false
  const error = validationResult(req);

  if (!error.isEmpty()) {
    success=false
    return res.status(400).json({success, error: error.array() })
  }
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      success=false
      return res.status(400).json({ success,error: "sorry user is already exist" })
    }
    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      password: secpass,
      email: req.body.email,
    });
console.log(user.id);
    const data = {
      user: {
        id: user.id
      }
    }
    console.log(data);
    const jwtData = jwt.sign(data,JWT_SECRET);
    console.log(jwtData)
    success=true
    res.json({success,jwtData})
  }

  catch (error) {
    console.error(error.message);
    res.status(500).send({success, error: "some error occur" });
  }
}

)

//Route2:User login Authentication of a user using :POST"/api/auth/login.No login required
router.post('/login', [
  body('password', "Cannot be blank").exists(),
  body('email', "Enter valid email").isEmail(),
],
  async (req, res) => {
   let success=false
    const error = validationResult(req);
    if (!error.isEmpty()) {
      success=false
      return res.status(400).json({ success,error: error.array() })
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
         success:false
        return res.status(400).json({success, error: "Please try to login with correct credential" })
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false
        return res.status(400).json({ success,error: "Please try to login with correct credential" })
      }
      const data = {
        user: {
          id: user.id
        }
      }
      console.log(user)
      success=true
      const authtoken = jwt.sign(data, JWT_SECRET)
      res.json({success,authtoken})
     
    }
    catch (error) {
      success=false;
      console.error(error.message);
      res.status(500).json({success, error: "some error occur" });//An HTTP status code is a message a website 's server sends to the browser to indicate whether or not that request can be fulfilled. Status codes specs are set by the W3C. Status codes are embedded in the HTTP header of a page to tell the browser the result of its request
    }
  })

  //Rouete3:get uer details:login reguired
  router.post('/getuser', fetchuser ,async(req,res)=>{
    try {
      userId=req.user.id
      const user=await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error occur");
    }
  })

module.exports = router
//Why is status code used?
//HTTP status codes are response codes sent by web servers in response to HTTP requests. Status codes signal that your webpage is OK (code 200) or give you a red flag (e.g. 404). These is very important for SEO. Search Engines should be able to properly crawl, parse, index and serve the specific URL with its content.
//.status for changing the status