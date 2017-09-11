const usersRepo  = require('../../../data/repos/usersRepository'),
      util       = require('util'),
      http       = require('http'),
      io         = require('socket.io').listen(http),
      port       = 8080;

class UsersController {

    constructor(router) {
        router.get('/', this.getUsers.bind(this));
        router.get('/:id', this.getUserById.bind(this));
        router.post('/:id', this.addUser.bind(this));

        this.userConnectionsList = [];
        this.init();
    }

    init(){
        var _this = this;
        console.log("******* init socket io*****");
        io.sockets.on('connection', function(socket){
            console.log("client connected: " + socket.id);
            usersRepo.addUserSocket(socket);

            socket.on('onInit', function(data){
                usersRepo.addUserId(data, socket);
            })
        });

        io.listen(port);
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
        
        const id = req.params.id;
        usersRepo.getUserById(id, (err, users) => {
            if (err) {
                return res.json(null);
            } else {
                if(users.length > 0)
                {
                    var ret = {exist: true};
                    return res.json(ret);
                }

                // console.log(JSON.parse(req.body));
                usersRepo.addUser(id, (err, user) => {
                    if (err) {
                        res.json({status: false, error: 'Insert failed',user: null});
                    } else {
                        var ret = {status: true, exist: false, user: user};
                        res.json(ret);
                    }
                });
            }
        });

    }
}

module.exports = UsersController;