const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://LQKA:lophocamsatss5@lqka.uuiei1y.mongodb.net/mindx');

const songSchema = new mongoose.Schema({
    name: String,
    author: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'users'}
})

const songModel = mongoose.model('songs', songSchema)

module.exports = { songModel }