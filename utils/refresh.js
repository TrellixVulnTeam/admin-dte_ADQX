const { sign, verify, refreshVerify } = require('./jwt-util');
const jwt = require('jsonwebtoken');

const refresh = async (req, res, next) => {


    if(req.cookies.authorization && req.cookies.refresh) {
        const authToken = req.cookies.authorization.split('Bearer')[1];
        const refreshToken = req.cookies.refresh;

        const authResult = verify(authToken);

        const decoded = jwt.decode(authToken);

        
        if(decoded === null) {
            req.status(401).send({
            ok : false,
            messages : 'no authorized!',
        });
        }

        const refreshResult = refreshVerify(refreshToken, decoded.signname);
        if(authResult.ok === false && authResult.message === 'jwt expired'){
            if(refreshResult.ok === false){
                res.status(401).send({
                    ok : false,
                    message : 'No authorized!',
                });
            } else {
                const newAccessToken = sign(decoded);
                res.cookie("accesToken",newAccessToken, {httpOnly : true});
                res.cookie("refreshToekn",refreshToken, {httpOnly : true});
                
                console.log('refresh',{
                            accessToken : newAccessToken,
                            refreshToken,
                        })
                                // res.status(200).send({
                //     ok : true,
                //     data : {
                //         accessToken : newAccessToken,
                //         refreshToken,
                //     }
                // });
            }
        } else {
            res.status(400).send({
                ok : false,
                message : 'Acess token is not expired!',
            });
        }
    } else {
        res.status(400).send({
            ok : false,
            message : 'Acess token and refresh token are need for refresh!',
        });
    }
}

module.exports = refresh;
