//nothing in this file is currently in use

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



function authUser(req, res, next){
    if (req.user == null) {
        res.status(403)
        return res.send('You need to sign in')
    }
    next()
}


function authRole(role){
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            return res.send('Not allowed')
        }
        next()
    }
}

async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}


module.exports = {
    authUser,
    authRole,
    hashPassword,
    
}
