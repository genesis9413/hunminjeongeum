const key = require('../config/secret.json');
const db = require('./database');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {};

// opts.jwtFromRequest = ExtractJwt.fromBodyField('jwt');
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret_key;

// passport.use('jwt',new JwtStrategy(opts, (jwt_payload, done) => {

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('payload received', jwt_payload);

    db.getConnection((err,connection)=>{
        if(err) console.log(err);
        else{
            connection.query('select * from user where user_id=?',[jwt_payload.user_id],(err,results)=>{
                if(err){
                    console.log(err);
                    connection.release();
                    return done(err,false);
                }else{
                    console.log(results);
                    if(results[0]) {
                        connection.release();
                        return done(null, results[0]);
                    }else{
                        connection.release();
                        console.log(results);
                        return done(null,false);
                    }
                }
            });
        }
    });

    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });

}));

passport.serializeUser((user, done) => {
    console.log('serializeUser',user);
    done(null,user.authID);
});

module.exports=passport;