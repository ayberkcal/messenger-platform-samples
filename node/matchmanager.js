/**
 * Created by ayberk on 30.12.2016.
 */
var user = require("./usermodel");
var chatmodel= require("./chatmodel");
var moment = require("moment");

var waitingUsersQueue  = [];
var chatQueue = [];
const uuidV4 = require('uuid/v4');
messagemanager = require('./messagemanager.js'),

module.exports = {
    startMatch: function (userId){
        var match = waitingUsersQueue.pop();

        //match bulunamazsa veya kendini bulursa tekrar listeye push etmemiz gerekiyor
        if(match == undefined){
            waitingUsersQueue.push(new user(uuidV4(),userId, moment(new Date())));
            messagemanager.sendMessage(userId, "Biraz bekle adam bulamadık 1");
        } else {
            if(match.userId == userId){
                waitingUsersQueue.push(match);
                messagemanager.sendMessage(userId, "Biraz bekle adam bulamadık 2");
            } else {
                console.log("Match oldu. UserID1: %d  UserID2: %d ", userId, match.userId);
                console.log(match);
                var newUser = new user(uuidV4(),userId, moment(new Date()));
                console.log(newUser);
                messagemanager.sendMessage(userId, "adam bulduk: '"+match.userId+"'  -  '"+match.nickname+"' ");
                messagemanager.sendMessage(match.userId, "adam bulduk: '"+newUser.userId+"' - '"+newUser.nickname+"' ");

                chatQueue.push(new chatmodel(match.nickname, match.userId, newUser.nickname, newUser.userId));
            }
        }
    },
    addToWaiting: function (userId) {
        var findedInQueue = false;
        for(var i = 0; i < waitingUsersQueue.length; i++){
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
            console.log("match bulundu. 1-UserID:'%d' 2-UserID:'%d'", userId, match.userId);
            messagemanager.sendMessage(userId, "Adam bulduk chat başlıcak");
            messagemanager.sendMessage(match.userId, "Adam bulduk chat başlıcak");
        }
    }
};