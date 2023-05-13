const express = require('express')
const { userModel } = require('../models/user')

const userRouter = express.Router()

const authorizationCheck = (req, res, next) => {
    const userRoles = req.user.role 
    // Check xem user nay co quyen lay toan bo user khong (Authorization) == check role
    if (userRoles.includes('admin')) {
        next()
    } else {
        res.send('User khong co quyen')
    }
}

userRouter.get('/', authorizationCheck, async (req, res) => {
    const users = await userModel.find({})
    res.send(users)
})

userRouter.patch('/', async (req, res) => {
    const {password} = req.body
    const user = req.user // {_id, username, password}
    // userModel.findByIdAndUpdate || userModel.findOneAndUpdate
})

userRouter.delete() // role admin

userRouter.get('/me', (req, res) => {
    res.send(req.user)
})

module.exports = { userRouter }