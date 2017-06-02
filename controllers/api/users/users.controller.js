const usersRepo  = require('../../../data/repos/usersRepository'),
      util       = require('util');

class UsersController {

    constructor(router) {
        router.get('/', this.getUsers.bind(this));
        router.get('/:id', this.getUserById.bind(this));
        router.post('/', this.addUser.bind(this));
        router.put('/:id', this.updateUser.bind(this));
        router.delete('/:id', this.deleteUser.bind(this));
    }

    //GET
    getUsers(req, res) {
        console.log('(*) Getting all users');

        usersRepo.getUsers((err, data) => {
            if (err) {
                res.json({
                    users: null
                });
            } else {
                res.json(data);
            }
        });
    }
    getUserById(req, res) {
        console.log('(*) Get user by id');

        const id = req.params.id;
        console.log(id);

        usersRepo.getUserById(id, (err, user) => {
            if (err) {
                res.json(null);
            } else {
                res.json(user);
            }
        });
    }

    //ADD
    addUser(req, res) {
        console.log('(*) Adding a user');
        console.log(req.body);
        // console.log(JSON.parse(req.body));
        usersRepo.addUser(req.body, (err, user) => {
                    if (err) {
                        res.json({status: false, error: 'Insert failed',user: null});
                    } else {
                        res.json({ status: true, error: null, user: user });
                    }
                });
    }

    //UPDATE
    updateUser(req, res) {
        console.log('(*) Update user by id');

        usersRepo.updateUser(req.params.id, req.body, (err) => {
            if (err) {
                res.json({ status: false });
            } else {
                res.json({ status: true });
            }
        });
    }

    //DELETE
    deleteUser(req, res) {
        console.log('(*) Delete user by id');

        usersRepo.deleteUser(req.params.id, (err) => {
            if (err) {
                res.json({ status: false });
            } else {
                res.json({ status: true });
            }
        });
    }
}

module.exports = UsersController;