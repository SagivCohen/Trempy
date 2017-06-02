const ridesRepo  = require('../../../data/repos/ridesRepository'),
      util       = require('util');

class RidesController {

    constructor(router) {
        router.get('/', this.getRides.bind(this));
        router.get('/params', this.getRidesByParams.bind(this));
        router.get('/driver/:id', this.getRidesByDriverId.bind(this));
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
        
        ridesRepo.getRidesByParams(req.query, (err, data) => {
            if (err) {
                res.json({
                    rides: null
                });
            } else {
                res.json(data);
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
                res.json({status: false, error: 'Insert failed', ride: null});
            } else {
                res.json({ status: true, error: null, ride: ride });
            }
        });
    }

    //UPDATE
    updateRide(req, res) {
        console.log('(*) Update ride by id');

        ridesRepo.updateRide(req.params.id, req.body, (err,ride) => {
            if (err) {
                res.json({ status: false });
            } else {
                res.json(ride);
            }
        });
    }
    joinRide(req, res) {
        console.log('(*) Join a Ride');

        ridesRepo.joinRide(req.body, (err,ride) => {
            if (err) {
                res.json({ status: false });
            } else {
                //TODO: Inform driverID (nice to have)
                res.json(req);
            }
        });
    }
    unjoinRide(req, res) {
        console.log('(*) Unjoin a Ride');

        ridesRepo.unjoinRide(req.body, (err,ride) => {
            if (err) {
                res.json({ status: false });
            } else {
                //TODO: Inform driverID (nice to have)
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