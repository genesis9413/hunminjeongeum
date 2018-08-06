const db = require('./database.js');

const bkfd2Password = require("pbkdf2-password");
const hasher= bkfd2Password();
const jwt = require('jsonwebtoken');

const key = require('../config/secret');

exports.register = (req,res) => {
    console.log(req.body);
    const {userid, password, realname} = req.body;
    hasher({password: password}, (err, pass, salt, hash) => {
        if(err) {
            console.log(err);
            res.status(500)
        }else {
            const user = {
                user_id: userid,
                user_hash: hash,
                user_salt: salt,
                user_name: realname
            };
            const sql = 'insert into user set ?';
            db.query(sql, user, (error) => {
                if (error) {
                    console.log(error);
                    res.status(500); //정확히 알아볼것
                } else {
                    console.log('성공!');
                    res.status(200).json({message: "success register"});
                    //성공스테이터스 or 리다이렉트
                }
            });
        }
    });
};

exports.login = (req,res) => {
    console.log('로그인',req.body);
    const { userid , password } = req.body; // 웹에서 널값 못보내도록 막기처리 해줘야
    const sql='select * from user where user_id=?';
    db.getConnection((err,connection)=>{
        if(err) console.log(err);
        else{
            connection.query(sql,[userid],(error,results) => {
                if(error){
                    connection.release();
                    console.log(error);
                }else{
                    const user = results[0];
                    if(!user){
                        connection.release();
                        return res.status(401).json({message:"no such user found"});
                    }
                    return hasher({password:password,salt:user.user_salt},(error, pass, salt, hash) => {
                        if(hash === user.user_hash) {
                            // id로 사람 구분
                            const payload = {user_id: userid};
                            console.log(key.secret_key);
                            const token = jwt.sign(payload, key.secret_key,{expiresIn: '30m'});
                            console.log('login',token);
                            connection.release();
                            res.json({token:token});
                            // res.json({message: "ok", token: token});
                        } else {
                            connection.release();
                            res.status(401).json({message:"passwords did not match"});
                        }
                    });
                }

            });

        }
    })

};