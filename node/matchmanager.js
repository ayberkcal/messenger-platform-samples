/**
 * Created by ayberk on 30.12.2016.
 */
var activeUsers = [];
var matchedUsers = []
module.exports = {
    addUser: function (userID) {
        if(!activeUsers.contains(userID)){
            activeUsers.push(userID);
        }
    },
    matchToSomeOne: function (userID) {

    }
};