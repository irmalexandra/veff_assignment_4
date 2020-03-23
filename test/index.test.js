//Importing the application to test
let server = require('../index');
let mongoose = require("mongoose");
let Event = require('../models/event');
let Booking = require('../models/booking');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Endpoint tests', () => {
    //###########################
    //These variables contain the ids of the existing event/booking
    //That way, you can use them in your tests (e.g., to get all bookings for an event)
    //###########################
    let eventId = '';
    let bookingId = '';

    //###########################
    //The beforeEach function makes sure that before each test, 
    //there is exactly one event and one booking (for the existing event).
    //The ids of both are stored in eventId and bookingId
    //###########################
    beforeEach((done) => {
        let event = new Event({
             name: "Test Event",
              capacity: 10, 
              startDate: 1590840000000, 
              endDate: 1590854400000

            });

        Event.deleteMany({}, (err) => {
            Booking.deleteMany({}, (err) => {
                event.save((err, ev) => {
                    let booking = new Booking({ eventId: ev._id, firstName: "Jane", lastName: "Doe", email: "jane@doe.com", spots: 2 });
                    booking.save((err, book) => {
                        eventId = ev._id;
                        bookingId = book._id;
                        done();
                    });
                });
            });
        });
    });

    //###########################
    //Write your tests below here
    //###########################

    it("should always pass", function() {
        console.log("Our event has id " + eventId);
        console.log("Our booking has id " + bookingId);
        chai.expect(1).to.equal(1);
    });


    describe("endpoint #1 test", ()=> {
        it('Should make a GET request', (done) => {
            chai.request('http://localhost:3000/api/v1/events').get('/').end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.json
                //chai.expect(res.body)
                done()
            })
        })
    })
    describe("endpoint #2 test", ()=> {
        it('Should make a GET specific request', (done) => {
            chai.request('http://localhost:3000/api/v1').get('/events/' + eventId).end((err, res) => {
                chai.expect(res).to.have.status(200);
                done()
            })
        })
    })
    describe("endpoint #3 test", ()=> {
        it('Should make a POST request', function(done) {
            chai.request('http://localhost:3000/api/v1').post('/events/').type('JSON').send({
                "name": "MartianMars",
                "capacity": 100000,
                "startDate": "2020-03-14T02:02:02.000Z",
                "endDate": "2020-03-25T08:05:03.000Z",
                "_id": "5e78b06eccacf926ec9b06a2"
            }).end((err, res) => {
                chai.expect(res).to.have.status(201);
                done();

            })

        })
    })
    

    describe("\nDelete tests", ()=> {

        describe("endpoint #8 test",() => {
            it('Should make a DELETE a specific booking', (done) => {
                chai.request('http://localhost:3000/api/v1').delete('/events/' + eventId + "/bookings/" + bookingId).auth("admin", "secret").end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                })
            })
        })


        describe("endpoint #4 test", ()=> {
            it('Should make a DELETE a specific request', (done) => {
                chai.request('http://localhost:3000/api/v1').delete('/events/' + eventId + "/bookings/" + bookingId).auth("admin", "secret").end(),
                chai.request('http://localhost:3000/api/v1').delete('/events/' + eventId).auth("admin", "secret").end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done()
                })
            })
        })

    })
    describe("\nendpoint #5 test", ()=> {
        it('Should make a GET all bookings for a specific event', (done) => {
            chai.request('http://localhost:3000/api/v1').get('/events/' + eventId + '/bookings').end((err, res) => {
                chai.expect(res).to.have.status(200);
                done()
            })
        })
    })
    describe("endpoint #6 test", ()=> {
        it('Should make a GET a specific booking from a specific event', (done) => {
            chai.request('http://localhost:3000/api/v1').get('/events/' + eventId + '/bookings/' + bookingId).end((err, res) => {
                chai.expect(res).to.have.status(200);
                done()
            })
        })
    })
    describe("endpoint #7 test", ()=> {
        it('Should make a POST request to make a booking for a specific event', function(done){
            chai.request('http://localhost:3000/api/v1').post('/events/'+ eventId + "/bookings").type('JSON').send({
                "firstName": "Emmi",
                "lastName": "Kjellinn",
                "tel": 4658734,
                "email": "IHateThisSyntax@wtf.com",
                "spots": 2
            }).end((err, res) => {
                chai.expect(res).to.have.status(201);
                done();
            })
    
        })
        it('Should fail a POST request to make a  booking for a specific event due to lack of telephone nr and email', function(done){
            chai.request('http://localhost:3000/api/v1').post('/events/'+ eventId + "/bookings").type('JSON').send({
                "firstName": "Emmi",
                "lastName": "Kjellinn",
                "spots": 2
            }).end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            })
        })
        it('Should fail a POST request to make a  booking for a specific event due to lack of spots selected', function(done){
            chai.request('http://localhost:3000/api/v1').post('/events/'+ eventId + "/bookings").type('JSON').send({
                "firstName": "Emmi",
                "lastName": "Kjellinn",
                "tel": 4658734,
                "email": "IHateThisSyntax@wtf.com"
            }).end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            })
        })
        it('Should fail a POST due to event id being wrong AF', function(done){
            chai.request('http://localhost:3000/api/v1').post('/events/'+ eventId + "23cool54/bookings").type('JSON').send({
                "firstName": "Emmi",
                "lastName": "Kjellinn",
                "tel": 4658734,
                "email": "IHateThisSyntax@wtf.com",
                "spots": 2
            }).end((err, res) => {
                chai.expect(res).to.have.status(404);
                done();
            })
    
        })
    })
    describe("Test * route", ()=> {
        it('A GET request to where ever ¯\\_(ツ)_/¯', function(done){
            chai.request('http://localhost:3000/api/v1/fd').get('/events/' + eventId + '/bookings/' + bookingId).end((err, res) => {
                chai.expect(res).to.have.status(405);
                done()
            })
    
        })
    })





});