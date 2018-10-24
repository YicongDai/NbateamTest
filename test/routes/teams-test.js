let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Teams', function () {
    describe('GET /teams', () => {
        it('should return all the teams in an array', function (done) {
            chai.request(server)
                .get('/teams')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(4);
                    // let result = _.map(res.body, (teams) => {
                    //     return { name: teams.name ,city:teams.city}
                    // });
                    expect(res.body[3]).to.include({name: "Golden State Warriors", city: "Oakland"});
                    expect(res.body[0]).to.include({name: "Los Angeles Lakers", city: "Los Angeles"});
                    expect(res.body[1]).to.include({name: "Cleveland Cavaliers", city: "Cleveland"});
                    expect(res.body[2]).to.include({name: "Los Angeles Cippers", city: "Los Angeles "});

                    done();
                });
        });
    });
    describe('GET /teams/:id', () => {
        it('should return the specific team', function (done) {
            chai.request(server)
                .get('/teams')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/teams/' + res.body[3]._id)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('Object');
                            expect(res.body).include({name: "Golden State Warriors", city: "Oakland"});
                            done();
                        });
                });
        });
    });
    describe('GET /names/:name', () => {
        it('should return the specific team with fuzzy search', function (done) {
            chai.request(server)
                .get('/teams')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/teams/name' + "/Los")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('array');
                            expect(res.body.length).to.equal(2);
                            // let result = _.map(res.body, (teams) => {
                            //     return { name: teams.name }
                            // });
                            expect(res.body[0]).include({name: "Los Angeles Cippers"});
                            expect(res.body[1]).include({name: "Los Angeles Lakers"});

                            done();
                        });
                });
        });
    });
    describe('GET /:id/info', () => {
        it('should return the specific player related to player schema', function (done) {
            chai.request(server)
                .get('/teams')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/teams/' + res.body[2]._id + "/info")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.have.property("message").equal('Team Successfully find player!');

                            expect(res.body).to.have.property("data");

                            expect(res.body.data).to.have.property("playerId");
                            expect(res.body.data.playerId).be.a('array');

                            expect(res.body.data.playerId[0]).include({name: "Avery Bradley"});

                            done();

                        });
                });
        });
    });
    describe('POST /teams', function () {
        it('should return confirmation message', function (done) {
            let team = {
                name: "Cleveland Cavaliers",
                city: "Cleveland",
                zone: {name: "Center Division", location: "East"},
                numPlayer: 20,
                championships: 1,
                rank: 4,
                playerId: [
                    "5bce36630255713614faa895"
                ]
            };
            chai.request(server)
                .post('/teams')
                .send(team)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Team Added Successfully!');
                    // expect(res.body).to.have.property('data');
                    // expect(res.body.data).to.be.a('object');
                    // expect(res.body.data).to.have.property('name');
                    // expect(res.body.data).to.have.property('city');
                    // expect(res.body.data.name).to.equal('Cleveland Cavaliers');
                    // expect(res.body.data.city).to.equal('Cleveland');
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/teams')
                .end(function(err, res) {
                    let result = _.map(res.body, (team) => {
                        return { name: team.name,
                            city: team.city };
                    }  );
                    expect(result).to.include( { name: 'Cleveland Cavaliers', city: "Cleveland"  } );
                    done();
                });
        });  // end-after
    }); // end-describe
    describe('PUT /teams/:id/rank', () => {
        it('should return a message and the rank changed', function(done) {
            chai.request(server)
                .get('/teams')
                .end(function (err, res) {
                    let rank={rank:111};
                    chai.request(server)
                        .put('/teams/' + res.body[4]._id+'/rank')
                        .send(rank)
                        .end(function (error, response) {
                            expect(response).to.have.status(200);
                            expect(response.body).to.be.a('object');
                            expect(response.body).to.have.property('message').equal('Team Successfully ChangeRank!' );
                            done()
                        });
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/teams')
                .end(function(err, res) {

                    expect( res.body[4].rank).equal(111) ;
                    done();
                });
        });  // end-after
    }); // end-describe

    describe('PUT /teams/:id/numPlayer', () => {
        it('should return a message and the nunmPlayer changed', function(done) {
            chai.request(server)
                .get('/teams')
                .end(function (err, res) {
                    let numPlayer={numPlayer:201};
                    chai.request(server)
                        .put('/teams/' + res.body[4]._id+'/numPlayer')
                        .send(numPlayer)
                        .end(function (error, response) {
                            expect(response).to.have.status(200);
                            expect(response.body).to.be.a('object');
                            expect(response.body).to.have.property('message').equal('Team Successfully Change NumPlayer!' );
                            done()
                        });
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/teams')
                .end(function(err, res) {

                    expect( res.body[4].numPlayer).equal(201) ;
                    done();
                });
        });  // end-after
    }); // end-describe

    // describe('PUT /teams/:id/playerId', () => {
    //     it('should return a message and the playerId changed', function(done) {
    //         chai.request(server)
    //             .get('/teams')
    //             .end(function (err, res) {
    //                 let playerId={playerId:['5bce34b10255713614faa893']};
    //                 chai.request(server)
    //                     .put('/teams/' + res.body[4]._id+'/playerId')
    //                     .send(playerId)
    //                     .end(function (error, response) {
    //                         expect(response).to.have.status(200);
    //                         expect(response.body).to.be.a('object');
    //                         expect(response.body).to.have.property('message').equal('Team Successfully Change playerId!' );
    //                         done()
    //                     });
    //             });
    //     });
    //     after(function  (done) {
    //         chai.request(server)
    //             .get('/teams')
    //             .end(function(err, res) {
    //
    //                 expect( res.body[4].playerId).equal(['5bce34b10255713614faa893']) ;
    //                 done();
    //             });
    //     });  // end-after
    // }); // end-describe
    describe('delete /teams/:id', () => {
        it('should delete a specific team', function(done) {
            chai.request(server)
                .get('/teams')
                .end(function (err, res) {
                    chai.request(server)
                        .delete('/teams/' + res.body[4]._id)
                        .end(function (error, response) {
                            expect(response).to.have.status(200);

                            expect(response.body).to.be.a('object');
                            expect(response.body).to.have.property('message').equal('Team Successfully Deleted!');
                            expect(response.body).to.have.property('data');
                            expect(response.body.data).to.have.property('_id');
                            expect(response.body.data._id).equal(res.body[4]._id);
                            done();
                        });
                });
        });
    });
});