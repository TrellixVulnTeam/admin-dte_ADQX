const { verify } = require('../utils/jwt-util');

const authJWT = (req, res, next) => {
    if ( req.cookies.authorization){
        const token = req.cookies.authorization.split('Bearer')[1];
        const result = verify(token);
        if(result.ok) {
            req.id = result.id;
            req.signname = result.signname;
            next();
        } else {
            next();
            // res.redirect('/login');
            // res.status(401).send({
            //     ok : false,
            //     message : result.message                
            // });
        }
    }else {
        next();
    }
}

module.exports = authJWT;