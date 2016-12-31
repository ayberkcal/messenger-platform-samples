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
    addToWaiting: function (userId) {
        var findedInQueue = false;
        console.log("1 waitinQueueSize:%d", waitingUsersQueue.length);
        for(var i = 0; i < waitingUsersQueue.length; i++){
            console.log("userId:%d", waitingUsersQueue[i].userId);
            if(waitingUsersQueue[i].userId == userId){
                findedInQueue = true;
                break;
            }
        }
        if(findedInQueue == false){
            module.exports.addToQueue(userId);
        } else {
            messagemanager.sendMessage(userId, "Dostum biraz beklettik biliyoruz ancak henüz kimse yok. ilk gelenle seni eşleştiricez emin olabilirsin...");
        }
    },
    addToQueue: function (userId) {
        var match = chatQueue.pop();
        if(match == undefined){
            console.log("match bulunmadı");
            messagemanager.sendMessage(userId, "Biraz bekle adam bulamadık");
            waitingUsersQueue.push(new user(uuidV4(),userId, moment(new Date())));
        } else {
            console.log("match bulundu");
            messagemanager.sendMessage(userId, "Adam bulduk chat başlıcak");
            messagemanager.sendMessage(match, "Adam bulduk chat başlıcak");
        }
    }
};