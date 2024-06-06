const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

function userVerification(req, res) {
    const token = req.cookies.token
    if (!token) {
        return res.json({ status: false })
    }
    jwt.verify(token, 'chowdary', async (err, data) => {
        if (err) {
            return res.json({ status: false })
        } else {
            const user = await User.findById(data.id)
            if (user) return res.json({ status: true, user: user })
            else return res.json({ status: false })
        }
    })
}

function isAuthenticated(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorised' })
    }
    jwt.verify(token, 'chowdary', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorised' })
        }
        else {
            req.userId = decoded.id
            next()
        }
    })
}
module.exports={ userVerification, isAuthenticated }