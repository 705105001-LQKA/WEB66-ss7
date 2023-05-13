const express = require('express');
const { songModel } = require('../models/song');

const songRouter = express.Router();

songRouter.post('/', async (req, res) => {
    try{
        const { name, author } = req.body;
        const song = await songModel.create({ name, author });
        res.send(song);
    } catch(e){
        console.log("Error", e);
        res.send("Server error");
    }
});

songRouter.patch('/update/:name', async (req, res) => {
    const name = req.params.name;
    const { author } = req.body;
    const song = await songModel.findOne({ name });
    if(song){
        const songUpdate = await songModel.findOneAndUpdate({ name }, { author }, { new: true});
        res.send(songUpdate);
    } else {
        res.send('Khong tim thay song');
    }
});

songRouter.delete('/delete/:name', async (req, res) => {
    const name = req.params.name;
    const currentSong = req.song;
    if(currentSong.name === name){
        res.status(400).send('Khong the xoa song nay')
        return
    }
    const song = await songModel.findOne({ name });
    if(song){
        await songModel.deleteOne({ name });
        res.send(name + " da bi xoa");
    } else {
        res.send("Khong tim thay song");
    }
});

module.exports = {songRouter};