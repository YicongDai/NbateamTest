var Players= require('../models/players');
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
    Players.find(function(err, players){
        if (err)
            res.send(err);

        res.send(JSON.stringify(players,null,5));
    });
};
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
  Players.find(function(err, players){
        if (err)
            res.send(err);

        res.send(JSON.stringify(players,null,5));
    });
};

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    Players.findOne({"name": req.params.name}, function (err, player) {
        if (err)
            res.json({message: 'Player NOT Found!', errmsg: err});
        else {
            if (player!=null)
                res.send(JSON.stringify(player, null, 5));
            else  res.json({ message: 'Player NOT Found! Please check the right id'} );
        }
    });
};
router.findTeamInformation= (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Players.findOne({"_id": req.params.id}).populate({path:'teamId',select: 'name city -_id'}).exec(function (err, info) {
        if (err)
            res.send(err);

        else
            res.send(JSON.stringify(info,null,5));
            // res.json({message:info.teamId,data:info});
    })

};

module.exports = router;