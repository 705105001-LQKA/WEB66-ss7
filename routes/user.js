const express = require('express');
const jwt = require('jsonwebtoken');
const { users, getAllUsers, userModel } = require('../models/user');

const userRouter = express.Router();

const authorizationCheck = (req, res, next) => {
    const userRoles = req.user.role;
    // Check xem user nay co quyen lay toan bo user khong (Authorization) == check role
    if (userRoles.includes('admin')) {
        next();
    } else {
        res.send('User khong co quyen');
    }
};

userRouter.get('/', authorizationCheck, async (req, res) => {
    const users = await userModel.find({});
    res.send(users);
});

// Update role cua user
userRouter.patch('/update/:username', authorizationCheck, async (req, res) => {
    const username = req.params.username;
    const { role, song } = req.body;
    // const user = req.user; // {_id, username, password}
    const user = await userModel.findOne({ username });
    if(user){
        const userUpdate = await userModel.findOneAndUpdate({ username }, { $push: {songs: song} }, { new: true});
        res.send(userUpdate);
    } else {
        res.send('Khong tim thay user');
    }
});

userRouter.post('/create', authorizationCheck, async () => {

});

userRouter.delete('/delete/:username', authorizationCheck, async (req, res) => {
    const username = req.params.username;
    const currentUser = req.user;
    if(currentUser.username === username){
        res.status(400).send('Khong the xoa user nay')
        return
    }
    const user = await userModel.findOne({ username });
    if(user){
        await userModel.deleteOne({ username });
        res.send(username + " da bi xoa");
    } else {
        res.send("Khong tim thay User");
    }
});

userRouter.get('/me', (req, res) => {
    res.send(req.user);
});

module.exports = { userRouter };