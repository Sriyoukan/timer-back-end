var express = require('express');
var router = express.Router();
var bp = require('body-parser')
const jwt = require('jsonwebtoken');

var User = require('../model/user')
const accessTokenSecret = 'sriyoukan19960505';


/* GET users listing. */
router.post('/signUp', function(req, res, next) {
  var user = new User()
  user.name=req.body.name
  user.setPassword(req.body.password)
  user.save((err,data)=>{
    if(err){
      res.status(500).json("couldn't signUp")
    }else{
      res.status(200).json("success")
    }
  })
});

router.post('/login',(req,res)=>{
  User.findOne({name:req.body.name},async (err,data)=>{
      
    if (err){
      return "err";
    }else{
        if(data == null){
            return null
        }else{
          user = new User(data)
          result =  user.validatePassword(req.body.password,user)
              if(result){
                const accessToken = jwt.sign({ name: user.name }, accessTokenSecret);
                res.json({
                  accessToken
              });

              }else{
                  res.status(500).json("username or password incorrect")
          }           }
    }
  })
})
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

router.get('/user',authenticateJWT,(req,res)=>{
  res.send(req.user)
})


module.exports = router;
