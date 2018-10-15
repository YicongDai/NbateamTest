let mongoose = require('mongoose');

let TeamSchema = new mongoose.Schema({
        name: String,
        city: String,
        zone:{name:String,location:String},
        numPlayer: Number,
        championships:Number,
        rank:Number

    },
    { collection: 'team' });

module.exports = mongoose.model('teams', TeamSchema );