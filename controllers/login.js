import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import express from 'express'
import User from '../models/user.js'

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findOne({ username: body.username })
    const passwordCorrrect = user === null ? false
        : await bcrypt.compare(body.password, user.passwordHash)
    if (!(user && passwordCorrrect)) {
        return response.status(401).json({
            error: 'invlid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
