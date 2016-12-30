/**
 * Created by ayberk on 30.12.2016.
 */
var waitinhUsersQueue  = [];
var chatQueue = [];
module.exports = {
    addToWaiting: function (userID) {
        if(!activeUsers.contains(userID)){
            activeUsers.push(userID);
        }
    },
    matchToSomeOne: function (userID) {

    }
};