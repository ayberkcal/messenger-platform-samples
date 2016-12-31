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
        } else {
            messagemanager.sendMessage(userID, "Dostum biraz beklettik biliyoruz ancak henüz kimse yok. ilk gelenle seni eşleştiricez emin olabilirsin...");
        }
    },
    addToQueue: function (userID) {
        var match = chatQueue.pop();
        if(match == undefined){
            messagemanager.sendMessage(userID, "Biraz bekle adam bulamadık");
            waitingUsersQueue.push(new user(uuidV4(),userID, moment(new Date())));
        } else {
            messagemanager.sendMessage(userID, "Adam bulduk chat başlıcak");
            messagemanager.sendMessage(match, "Adam bulduk chat başlıcak");
        }
    }
};