const ridesRepo = require('../../../data/repos/preferencesRepository'),
    util = require('util');


class PreferencesController {

    constructor(router) {
        router.put('/:id', this.createOrUpdateUserPreferences.bind(this));
    }

    //UPDATE
    createOrUpdateUserPreferences(req, res) {
        console.log('(*) Update UserPreferences by id');

        ridesRepo.createOrUpdateUserPreferences(req.params.id, req.body, (err, ride) => {
            if (err) {
                res.json({status: false});
            } else {
                res.json(true);
            }
        });
    }
}

module.exports = PreferencesController;