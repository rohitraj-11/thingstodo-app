const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        //const token = req.header('Authorization').replace('Bearer ', '')
        
        const token = req.cookies.token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user || !token) {
            throw new Error()
        }

        req.token = token
        req.user = user

        console.log('Authenticated Successfully.')

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth