import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const usersRouter = express.Router()

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })
    const savedUser = await user.save()
    response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

export default usersRouter
