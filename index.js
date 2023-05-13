const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { songRouter } = require('./routes/song');
const jwt = require('jsonwebtoken');
const { users, userModel } = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const authenticationCheck = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, '123@lol');
    const { username } = decoded;
    // Check user co trong co so du lieu khong 
    const user = await userModel.findOne({ username: username }).populate("songs").select({password: 0});
    // findOne tra ve 1 ptu
    if (user) {
        req.user = user;
        next();
    } else {
        res.send('User khong ton tai');
    }
};

app.use('/users', authenticationCheck, userRouter);
app.use('/song', authenticationCheck, songRouter);

app.get('/', (req, res) => {
    res.send('Home router');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // Check trung username trong db, 
    // neu trung username thi khong cho tao user, neu khong trung thi tao user
    // => tim user co username == req.body.username
    // => neu ton tai thi res.send('User da ton tai')
    // => neu khong thi create
    const existringUser = await userModel.findOne({ username });
    if(existringUser){
        res.send("User da ton tai");
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt); 
        const newUser = await userModel.create({ username, password: hashPassword, role: ['user'] });
        res.send(newUser);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Check trong db
    const user = await userModel.findOne({ username }); 
    // find tra ve mang
    // Neu co user thi tra token, con ko thi tra loi
    if(user && bcrypt.compare(password, user.password)){
        const token = jwt.sign({ username: username }, '123@lol');
        // Tra token cho client
        res.send({ token: token });
    } else {
        res.send("Ko thay user");
    }
});

app.listen(3000);
console.log('Server running');

module.exports = app;