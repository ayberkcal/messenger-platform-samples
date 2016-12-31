/**
 * Created by ayberk on 30.12.2016.
 */
var user = require("./usermodel");
var moment = require("moment");

var waitingUsersQueue  = [];
var chatQueue = [];
const uuidV4 = require('uuid/v4');
messagemanager = require('./messagemanager.js'),

module.exports = {
    addToWaiting: function (userID) {
        var findedInQueue = false;
        console.log("1 waitinQueueSize:%d", waitingUsersQueue.length);
        for(var i = 0; i < waitingUsersQueue.length; i++){
            console.log("userId:%d", waitingUsersQueue[i].userId);
            if(waitingUsersQueue[i].userId == userID){
                findedInQueue = true;
                break;
            }
        }
        if(findedInQueue == false){
            module.exports.addToQueue(userID);
        }
        //if(!activeUsers.contains(userID)){
        //    activeUsers.push(userID);
        //}
    },
    addToQueue: function (userID) {
        console.log("try adding to queue %d", userID);
        console.log("2 waitinQueueSize:%d", waitingUsersQueue.length);
        var match = chatQueue.pop();
        console.log("match:" + match);
        if(match == undefined){
            messagemanager.sendMessage(userID, "Biraz bekle adam bulamadık");
            waitingUsersQueue.push(new user(uuidV4(),userID, moment(new Date())));
        } else {
            messagemanager.sendMessage(userID, "Adam bulduk chat başlıcak");
        }
        console.log("3 waitinQueueSize:%d", waitingUsersQueue.length);
    }
};