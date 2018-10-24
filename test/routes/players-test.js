let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Players', function () {
    describe('GET /players', () => {
        it('should return all the players in an array', function (done) {
            chai.request(server)
                .get('/players')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(5);
                    // let result = _.map(res.body, (teams) => {
                    //     return { name: teams.name ,city:teams.city}
                    // });
                    expect(res.body[0]).to.include({name: "Stephen Curry"});
                    expect(res.body[1]).to.include({name: "Kevin Durant"});
                    expect(res.body[2]).to.include({name: "Avery Bradley"});
                    expect(res.body[3]).to.include({name: "LeBorn James"});
                    expect(res.body[4]).to.include({name: "Kevin Love"});
                    done();
                });
        });
    });
    describe('GET /players/:name', () => {
        it('should return the specific player', function (done) {
            chai.request(server)
                .get('/players')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/players/' + res.body[0].name)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('Object');
                            expect(res.body).include({name: "Stephen Curry"});
                            done();
                        });
                });
        });
    });
    describe('GET /names/:name', () => {
        it('should return the specific player with fuzzy search', function (done) {
            chai.request(server)
                .get('/players')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/players/name' + "/s")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('array');
                            expect(res.body.length).to.equal(2);

                            expect(res.body[0]).include({name: "LeBorn James"});
                            expect(res.body[1]).include({name: "Stephen Curry"});

                            done();
                        });
                });
        });
    });
    describe('GET /position/:position', () => {
        it('should return the specific player with fuzzy search', function (done) {
            chai.request(server)
                .get('/players')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/players/position' + "/sf")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('array');
                            expect(res.body.length).to.equal(2);

                            expect(res.body[0]).include({name: "LeBorn James"});
                            expect(res.body[1]).include({name: "Kevin Durant"});

                            done();
                        });
                });
        });
    });
    describe('GET /:id/info', () => {
        it('should return the specific player related to player schema', function (done) {
            chai.request(server)
                .get('/players')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/players/' + res.body[0]._id + "/info")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.have.property("message").equal('Player Successfully find team!');

                            expect(res.body).to.have.property("data");

                            expect(res.body.data).to.have.property("teamId");
                            expect(res.body.data.teamId).be.a('Object');

                            expect(res.body.data.teamId).include({name: "Golden State Warriors"});

                            done();

                        });
                });
        });
    });
    describe('POST /players', function () {
        it('should return confirmation message', function (done) {
            let player= {
                name:"Stephen Curry1",
                age:30,
                height:191,
                weight:86,
                nationality:"USA",
                position: "PG/SG",
                teamId:"5bd0e6547a18b008fca9f57d",
                salary:3746,
                joinTime:"2009"

            };
            chai.request(server)
                .post('/players')
                .send(player)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Player Added Successfully!');
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.be.a('object');
                    expect(res.body.data).to.have.property('name');

                    expect(res.body.data.name).to.equal('Stephen Curry1');
                    done();
                });
        });
    //     after(function  (done) {
    //         chai.request(server)
    //             .get('/player')
    //             .end(function(err, res) {
    //                 // let result = _.map(res.body, (player) => {
    //                 //     return { name: player.name,
    //                 //          };
    //                 // }  );
    //                 expect(res.body[5]).to.include( { name: 'Stephen Curry1s' } );
    //                 done();
    //             });
    //     });  // end-after
    }); // end-describe
    describe('PUT /players/:id/salary', () => {
        it('should return a message and the salary changed', function(done) {
            chai.request(server)
                .get('/players')
                .end(function (err, res) {
                    let salary={salary:111};
                    chai.request(server)
                        .put('/players/' + res.body[5]._id+'/salary')
                        .send(salary)
                        .end(function (error, response) {
                            expect(response).to.have.status(200);
                            expect(response.body).to.be.a('object');
                            expect(response.body).to.have.property('message').equal('Player Successfully Change salary!' );
                            done()
                        });
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/players')
                .end(function(err, res) {

                    expect( res.body[5].salary).equal(111) ;
                    done();
                });
        });  // end-after
    }); // end-describe

    // describe('PUT /players/:id/teamId', () => {
    //     it('should return a message and the teamId changed', function(done) {
    //         chai.request(server)
    //             .get('/players')
    //             .end(function (err, res) {
    //                 let playerId={playerId:201};
    //                 chai.request(server)
    //                     .put('/players/' + res.body[5]._id+'/teamId')
    //                     .send(playerId)
    //                     .end(function (error, response) {
    //                         expect(response).to.have.status(200);
    //                         expect(response.body).to.be.a('object');
    //                         expect(response.body).to.have.property('message').equal('Player Successfully Change teamId!' );
    //                         done()
    //                     });
    //             });
    //     });
    //     after(function  (done) {
    //         chai.request(server)
    //             .get('/players')
    //             .end(function(err, res) {
    //
    //                 expect( res.body[5].teamId).equal(201) ;
    //                 done();
    //             });
    //     });  // end-after
    // }); // end-describe
    describe('delete /players/:id', () => {
        it('should delete a specific player', function(done) {
            chai.request(server)
                .get('/players')
                .end(function (err, res) {
                    chai.request(server)
                        .delete('/players/' + res.body[5]._id)
                        .end(function (error, response) {
                            expect(response).to.have.status(200);

                            expect(response.body).to.be.a('object');
                            expect(response.body).to.have.property('message').equal('Player Successfully Deleted!');
                            expect(response.body).to.have.property('data');
                            expect(response.body.data).to.have.property('_id');
                            expect(response.body.data._id).equal(res.body[5]._id);
                            done();
                        });
                });
        });
    });
});