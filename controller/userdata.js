
const passport = require('../controller/passport');

exports.test = (req,res) => {

    console.log(req.body);
    console.log(req.user);
};