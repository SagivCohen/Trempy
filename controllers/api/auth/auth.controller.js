const ridesRepo  = require('../../../data/repos/ridesRepository'),
      util       = require('util');

class AuthController {

    constructor(router) {
        router.get('/status', this.status.bind(this));
		router.post('/login', this.login.bind(this));
		router.get('/logout', this.logout.bind(this));
    }

	//GET
	status(req, res) {
		if (req.cookies.remember) {
			console.log(true);
			res.send(true);
		} else {
			console.log(false);
			res.send(false);
		}
    }

    login(req, res) {
		var week = 1000 * 60 * 60 * 24 * 7;
		if (!req.body.remember) res.cookie('remember', 1, { maxAge: week, httpOnly: true });
		res.send(true);
    }

	logout(req, res) {
		res.clearCookie('remember');
  		res.send(true);
    }
}

module.exports = AuthController;