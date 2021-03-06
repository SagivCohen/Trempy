const ridesRepo = require('../../../data/repos/ridesRepository'),
    distanceUtil = require('../../../logic/distanceLogic'),
    usersRepo  = require('../../../data/repos/usersRepository');

class RidesController {

    constructor(router) {
        router.get('/', this.getRides.bind(this));
        router.get('/params', this.getRidesByParams.bind(this));
        router.get('/driver/:id', this.getRidesByDriverId.bind(this));
        router.get('/joined/:id', this.getJoinedRidesByUserId.bind(this));
        router.get('/:id', this.getRideById.bind(this));

        router.post('/', this.addRide.bind(this));

        router.put('/join', this.joinRide.bind(this));
        router.put('/unjoin', this.unjoinRide.bind(this));
        router.put('/:id', this.updateRide.bind(this));

        router.delete('/:id', this.deleteRide.bind(this));
    }


    //GET
    getRides(req, res) {
        console.log('(*) Get all rides');
        ridesRepo.getRides((err, data) => {
            if (err) {
                res.json({
                    rides: null
                });
            } else {
                res.json(data);
            }
        });
    }
    getRidesByParams(req, res) {
        console.log('(*) Get Rides By Params');

        // ridesRepo.getRidesByParams(req.query, (err, data) => {
        //     if (err) {
        //         res.json({
        //             rides: null
        //         });
        //     } else {
        //         res.json(data);
        //     }
        // });

        var src = req.query.src.split("T");
        src = { long: src[0], lat: src[1] };

        var dst = req.query.dst.split("T");
        dst = { long: dst[0], lat: dst[1] };

        console.log(req.query);
        console.log(' ');

        ridesRepo.getRides((err, allRides) => {
            if (err) {
                res.json({
                    rides: null
                });
            } else {

                distanceUtil.getRidesByDistance(src, dst, req.query.date, allRides , function (filterRides) {
                    console.log("Filtered Rides:");
                    console.log(filterRides);
                    console.log(" ");
                    

                    return res.json(filterRides);
                });

                // return res.json(allRides);
            }
        });
    }
    getRidesByDriverId(req, res) {
        console.log('(*) Get ride by driver id');

        const id = req.params.id;
        console.log(id);

        ridesRepo.getRidesByDriverId(id, (err, ride) => {
            if (err) {
                res.json(null);
            } else {
                res.json(ride);
            }
        });
    }
    getJoinedRidesByUserId(req, res) {
        console.log('(*) Get joined rides by user id');

        const id = req.params.id;

        ridesRepo.getJoinedRidesByUserId(id, (err, ride) => {
            if (err) {
                res.json(null);
            } else {
                res.json(ride);
            }
        });
    }
    getRideById(req, res) {
        console.log('(*) Get ride by id');

        const id = req.params.id;
        console.log(id);

        ridesRepo.getRideById(id, (err, ride) => {
            if (err) {
                res.json(null);
            } else {
                res.json(ride);
            }
        });
    }

    //ADD
    addRide(req, res) {
        console.log('(*) Adding a ride');

        ridesRepo.addRide(req.body, (err, ride) => {
            if (err) {
                res.json({ status: false, error: 'Insert failed', ride: null });
            } else {
                res.json({ status: true, error: null, ride: ride });
            }
        });
    }

    //UPDATE
    updateRide(req, res) {
        console.log('(*) Update ride by id');

        ridesRepo.updateRide(req.params.id, req.body, (err, ride) => {
            if (err) {
                res.json({ status: false });
            } else {
                res.json(ride);
            }
        });
    }
    joinRide(req, res) {
        console.log('(*) Join a Ride');
        ridesRepo.joinRide(req.body, (err, ride) => {
            if (err) {
                res.json({ status: false });
            } else {
                //TODO: Inform driverID (nice to have)
                console.log("the ride is: "+ ride);
                usersRepo.handleJoinRide(ride, req.body.userId);
                res.json(ride);
            }
        });
    }
    unjoinRide(req, res) {
        console.log('(*) Unjoin a Ride');

        ridesRepo.unjoinRide(req.body, (err, ride) => {
            if (err) {
                res.json({ status: false });
            } else {
                //TODO: Inform driverID (nice to have)
                usersRepo.handleUnJoinRide(ride, req.body.userId);
                res.json(ride);
            }
        });
    }

    //DELETE
    deleteRide(req, res) {
        console.log('(*) Delete ride by id');

        ridesRepo.deleteRide(req.params.id, (err) => {
            if (err) {
                res.json({ status: false });
            } else {
                res.json({ status: true });
            }
        });
    }
}

module.exports = RidesController;