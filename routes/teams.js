var Teams = require('../models/teams');

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// var mongodbUri ='mongodb://studentsinfodb:dycwjh123@ds247061.mlab.com:47061/studentsinfodb';
// mongoose.connect(mongodbUri);
mongoose.connect('mongodb://localhost:27017/NBAteamdb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Teams.find(function(err, teams){
        if (err)
            res.send(err);

        res.send(JSON.stringify(teams,null,5));
    });
}
module.exports = router;