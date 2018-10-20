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

router.findOneByName= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.name;

    var _filter={
        $or: [

            {name: {$regex: keyword, $options: '$i'}},

        ]
    }
    var count = 0
    Players.count(_filter, function (err, doc) {
        if (err) {
            res.json({errmsg: err});
        } else {
            count = doc
        }
    })

   Players.find(_filter).limit(10)
        .sort({'_id': -1})
        .exec(function (err, players) {
            if (err||players.length==0) {
                res.json({message:"Players Not Found!",errmsg: err});
            } else {
                res.send(JSON.stringify(players,null,5));
            }

        });
};
router.findOneByPosition= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.position;

    var _filter={
        $or: [

            {position: {$regex: keyword, $options: '$i'}},

        ]
    }
    var count = 0
    Players.count(_filter, function (err, doc) {
        if (err) {
            res.json({errmsg: err});
        } else {
            count = doc
        }
    })

    Players.find(_filter).limit(10)
        .sort({'_id': -1})
        .exec(function (err, players) {
            if (err||players.length==0) {
                res.json({message:"Players Not Found!",errmsg: err});
            } else {
                res.send(JSON.stringify(players,null,5));
            }

        });
};
router.addPlayer = (req, res) => {


    res.setHeader('Content-Type', 'application/json');

    var player = new Players();

    player.name =  req.body.name;
    player.age=req.body.age;
    player.height=req.body.height;
    player.weight=req.body.weight;
    player.nationality=req.body.nationality;
    player.position=req.body.position;
    player.teamId=req.body.teamId;
    player.salary=req.body.salary;
    player.joinTime=req.body.joinTime;

    player.save(function(err) {
        if (err)
            res.json({ message: 'Player NOT Added!', errmsg : err } );// return a suitable error message
        else
            res.json({ message: 'Player Added Successfully!',data:player});// return a suitable success message
    });
};
router.changeSalary = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Players.findById(req.params.id/*id from request parameters*/, function (err, team) {
        if (err)
            res.json({message: 'Player NOT Found!', errmsg: err});
        else {
            if (team != null) {
                Players.update({_id: req.params.id}, {salary: req.body.salary}, function (err) {
                    if (err)
                        res.json({message: 'Player NOT Change salary!', errmsg: err});
                    else
                        res.json({message: 'Player Successfully Change salary!'});
                });
            }
            else
                res.json({message: 'Player NOT Found! Please check the right id'});
        }
    });
};

// router.changeRank = (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//
//     Teams.findById(req.params.id/*id from request parameters*/, function (err, team) {
//         if (err)
//             res.json({message: 'Team NOT Found!', errmsg: err});
//         else {
//             if (team != null) {
//                 Teams.update({_id: req.params.id}, {rank: req.body.rank}, function (err) {
//                     if (err)
//                         res.json({message: 'Team NOT ChangeRank!', errmsg: err});
//                     else
//                         res.json({message: 'Team Successfully ChangeRank!'});
//                 });
//             }
//             else
//                 res.json({message: 'Team NOT Found! Please check the right id'});
//         }
//     });
// };

router.deletePlayer= (req, res) => {

    Players.findByIdAndRemove(req.params.id, function (err,player) {
        if (err)
            res.json({message: 'Player NOT DELETED!', errmsg: err});
        else {
            if (player != null)
                res.json({message: 'Player Successfully Deleted!'});

            else
                res.json({message: 'Player NOT Found! Please check the right id'});
        }
    });
};
module.exports = router;