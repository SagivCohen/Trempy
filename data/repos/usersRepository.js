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

        User.findById(id, (err, user) => {
            if (err) { 
                console.log(`(!) Failed to get user by id: ${err}`); 
                return callback(err); 
            }
            callback(null, user);
        });
    }

    //ADD
    addUser(body, callback) {

        var user = new User();
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.age = body.age;
        user.facebookID = body.facebookID;
        user.googleID = body.googleID;

        user.save((err, user) => {
            if (err) { 
                console.log(`(!) Failed to add a user to DB: ${err}`); 
                return callback(err, null); 
            }

            callback(null, user);
        });
    }

    //UPDATE
    updateUser(id, body, callback) {

        User.findById(id, (err, user) => {
            if (err) { 
                console.log(`(!) Failed to get user by id: ${err}`); 
                return callback(err); 
            }
            
            user.firstName = body.firstName || user.firstName;
            user.lastName = body.lastName || user.lastName;
            user.age = body.age || user.age;
            user.facebookID = body.facebookID || user.facebookID;
            user.googleID = body.googleID || user.googleID;
        

            user.save((err, user) => {
                if (err) { 
                    console.log(`(!) Failed to update a user in DB: ${err}`); 
                    return callback(err, null); 
                }

                callback(null, user);
            });
        });
    }

    //DELETE
    deleteUser(id, callback) {

        User.remove({ '_id': id }, (err, user) => {
            if (err) { 
                console.log(`(!) Failed to get delete user: ${err}`); 
                return callback(err, null); 
            }
            callback(null, user);
        });
    }
}

module.exports = new UsersRepository();

