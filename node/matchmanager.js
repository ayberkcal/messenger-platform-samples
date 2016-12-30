/**
 * Created by ayberk on 30.12.2016.
 */
var waitingUsersQueue  = [];
var chatQueue = [];
const uuidV4 = require('uuid/v4');
messagemanager = require('./messagemanager.js'),

module.exports = {
    addToWaiting: function (userID) {
        var findedInQueue = false;
        for(var i = 0; i < waitingUsersQueue.length; i++){
            if(waitingUsersQueue[i].userId == userID){
                findedInQueue = true;
                break;
            }
        }
        if(findedInQueue == false){
            addToQueue(userID);
        }
        if(!activeUsers.contains(userID)){
            activeUsers.push(userID);
        }
    },
    addToQueue: function (userID) {
        var match = chatQueue.pop();
        if(match == undefined){
            messagemanager.sendMessage(userID, "Biraz bekle adam bulamadık");
        } else {
            messagemanager.sendMessage(userID, "Adam bulduk chat başlıcak");
        }
    }
};