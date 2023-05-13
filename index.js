const express = require('express')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const jwt = require('jsonwebtoken')
const { users, userModel } = require('./models/user')

const app = express()

app.use(express.json())

const authenticationCheck = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, '123@lol');
    const { username } = decoded
    // Check user co trong co so du lieu khong 
    const user = await userModel.findOne({ username: username })
    if (user) {
        req.user = user
        next()
    } else {
        res.send('User khong ton tai')
    }
}

app.use('/users', authenticationCheck, userRouter)
// app.use('/song', songRouter)

app.get('/', (req, res) => {
    res.send('Home router')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    // Check trung username trong db, 
    // neu trung username thi khong cho tao user, neu khong trung thi tao user
    // => tim user co username == req.body.username
    // => neu ton tai thi res.send('User da ton tai')
    // => neu khong thi create
    const existingUser = await userModel.findOne({ username })
    if (existingUser) {
        res.send('User da ton tai')
    } else {
        const user = await userModel.create({ username, password, role: ['user'] })
        res.send(user)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    // Check trong db
    const user = await userModel.findOne({ username, password })
    // Nếu có user thì trả token, còn không thì trả lỗi
    if (user) {
        const token = jwt.sign({ username: username }, '123@lol')
        // Tra token cho client
        res.send({ token: token })
    } else {
        res.send('Khong tim thay user')
    }
})

app.listen(3000)
console.log('Server running')

module.exports = app;