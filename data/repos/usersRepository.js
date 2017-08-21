const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('../models/user');

class UsersRepository {

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

