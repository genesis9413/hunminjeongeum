var express = require('express');
var router = express.Router();

const watson = require('watson-developer-cloud/assistant/v1');
const fs = require('fs');

const userdata = require('../controller/userdata');
const passport = require('../controller/passport');

const config = JSON.parse(fs.readFileSync('conf.json','utf8'));
const assistant = new watson({
    version : config.watson.version,
    username : config.watson.username,
    password : config.watson.password
});

const auth = require('../controller/auth');

let path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({
        asd : 'akakak',
        sdf:'sdfaffa'
    })
  // res.render('index', { title: 'Express' });
});

router.post('/register',auth.register);

router.post('/login',auth.login);
// router.post('/tt',userdata.test);

router.get('/test',(req,res)=>{
  assistant.message({
      workspace_id: 'fdcd0cbc-0841-4738-8df3-50d1202a2b7b',
      input:{'text':'날씨'}
  },(err,response)=>{
    if(err){
      console.log(err);
    }else{
      console.log(JSON.stringify(response,null,2));
    }
  })
});

router.get('/word',(req,res)=>{
    con.connect((err)=>{
        if(err) console.log(err);
        con.query("select word_word,word_mean from word",(err,results)=>{
            if(err) console.log(err);
            else{
                res.json(results);
            }
        });

    })
});

router.post('/tt',passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log(req.body);
    console.log(req.user);
});
// router.get('/testest',(req,res)=>{
// });


module.exports = router;
