const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const messages = require('../utils/messages');
const secret = process.env.SECRET;

module.exports = {
    sign : (user) => {
        const payload = {
            id : user.id,
            signname : user.admin_signname,
        }
        
        return jwt.sign(payload, secret, {
            algorithm : 'HS256',
            expiresIn : '10s',
        });
    },

    verify : (token) =>{
        let decoded = null;
        try{
            decoded = jwt.verify(token, secret);
            return {
                ok : true,
                id : decoded.id,
                signname : decoded.signname,
            };
        } catch (err) {
            return{
                ok : false,
                message : err.message,
            };
        }
    },

    refresh : () => {
        return jwt.sign({}, secret, {
            algorithm : 'HS256',
            expiresIn : '14d',
        });
    },

    refreshVerify : async (token, signname) => {
        const getAsync = promisify(redisClient.get).bind(redisClient);
        
        try {
            console.log("signname : ",signname)
            const data = await getAsync(signname);
            console.log("ok");
            console.log(data);
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else { 
                return false;
            }
        } catch (err) {
            return false;
        }
    },
};