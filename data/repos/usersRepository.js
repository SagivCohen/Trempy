const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('../models/user');

class UsersRepository {

     constructor(){
        this.userConnectionsList = [];
    }

addUserSocket(socket){
    var _this = this;
    for(var i in _this.userConnectionsList){
        if(_this.userConnectionsList[i].socketid === socket.id){
            return;
        }
    }

    var user = new UserSocket("", socket.id, socket);
    _this.userConnectionsList.push(user);

    console.log(_this.userConnectionsList);
}

addUserId(userId, socket){
    var _this = this;
    for(var i in _this.userConnectionsList){
        console.log("start init user id: " + userId);
        if(_this.userConnectionsList[i].socketId === socket.id){
            _this.userConnectionsList[i].id = userId;
            console.log("success");
            break;
        }
    }
}

handleJoinRide(ride, userId){
    var _this = this;
    console.log(ride);
    for(var i in _this.userConnectionsList){
        if(_this.userConnectionsList[i].id === ride.driverId){
            _this.userConnectionsList[i].socket.emit('onJoinTremp', userId);
        }
    }

}

    //GET
    getUsers(callback) {

        User.find({}, (err, users) => {
            if (err) { 
                console.log(`(!) Failed to get all users: ${err}`); 
                return callback(err); 
            }
            callback(null, users);
        });
    }
    getUserById(id, callback) {

        User.find({ 'userId': id}, (err, user) => {
            if (err) { 
                console.log(`(!) Failed to get user by id: ${err}`); 
                return callback(err); 
            }
            callback(null, user);
        });
    }

    //ADD
    addUser(id, callback) {

        var user = new User();
        user.userId = id;

        user.save((err, user) => {
            if (err) { 
                console.log(`(!) Failed to add a user to DB: ${err}`); 
                return callback(err, null); 
            }
            return callback(null, user);
        });
    }
}

module.exports = new UsersRepository();

