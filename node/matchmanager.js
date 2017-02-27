/**
 * Created by ayberk on 30.12.2016.
 */
var user = require("./usermodel"),
    chatmodel= require("./chatmodel"),
    moment = require("moment"),
    graph = require("./graphhelper.js"),
    _localize = require ("localize"),
    _nicknamemanager= require("./nicknamemanager");



var waitingUsersQueue  = [];
var chatQueue = [];
const uuidV4 = require('uuid/v4');
messagemanager = require('./messagemanager.js'),

module.exports = {
    startMatch: function (userId) {
        var localize = new _localize('./translations/', undefined, "tr");
        var findInChatQueue = findInChatQueue(userId);

        //match bulunursa gönderiyoruz mesjaı
        if (findInChatQueue != undefined) {
            var userLang = findInChatQueue.first_user.userId == userId ? findInChatQueue.first_user.lang : findInChatQueue.second_user.lang;
            //userLang = userLang.split('_')[0];
            localize.setLocale(userLang);
            messagemanager.sendMessage(userId, localize.translate("Dostum hali hazırda birisiyle konuşuyorsun o yüzden önce konuşmadan çıkman gerek"));
            return;
        }

        var match = waitingUsersQueue.pop();


        //match bulunamazsa veya kendini bulursa tekrar listeye push etmemiz gerekiyor
        if (match == undefined) {
            graph.getUserInfo(userId, function(body){
                var response = JSON.parse(body)
                var userLang = response.locale.toString().split('_')[0];
                console.log("userlang:" + userLang);
                waitingUsersQueue.push(new user(_nicknamemanager.getNickName(), userId, moment(new Date()), userLang));
                localize.setLocale(userLang);
                messagemanager.sendMessage(userId, localize.translate("Biraz bekle adam bulamadık 1"));
            });
            //var userLang = graph.getUserInfo(userId).locale.split('_')[0];

        } else {
            if (match.userId == userId) {
                waitingUsersQueue.push(match);
                localize.setLocale(match.lang);
                console.log("lang:" + match.lang);
                messagemanager.sendMessage(userId, localize.translate("Biraz bekle adam bulamadık 2"));
            } else {
                console.log("Match oldu. UserID1: %d  UserID2: %d ", userId, match.userId);
                console.log(match);
                var newUser = new user(_nicknamemanager.getNickName(), userId, moment(new Date()), userLang);
                console.log(newUser);
                localize.setLocale(match.lang);
                messagemanager.sendMessage(userId, localize.translate("adam bulduk '$[1]' - '$[2]'", match.userId, match.nickname));
                localize.setLocale(newUser.lang);
                messagemanager.sendMessage(match.userId, localize.translate("adam bulduk '$[1]' - '$[2]'", newUser.userId, newUser.nickname));

                chatQueue.push(new chatmodel(match.nickname, match.userId, newUser.nickname, newUser.userId));
            }
        }
    },
    endChat: function (userId) {
        var conversation = findInChatQueue(userId);
        if (conversation == undefined) {
            messagemanager.sendMessage(userId, "dostum zaten chat yapmıyorsun nerden çıkmaya çalışıyorsun?");
        } else {
            removeFromChatQueue(userId);
            if (conversation.first_userId == userId) {
                messagemanager.sendMessage(conversation.first_userId, "dostum konuşmadan çıktın.Tekrar konuşmak için /ekle yaz...");
                messagemanager.sendMessage(conversation.second_userId, "dostum " + conversation.second_nickname + " konuşmadan çıktı. Tekrar konuşmak için /ekle yaz...");
            } else {
                messagemanager.sendMessage(conversation.second_userId, "dostum konuşmadan çıktın.Tekrar konuşmak için /ekle yaz...");
                messagemanager.sendMessage(conversation.first_userId, "dostum " + conversation.second_nickname + " konuşmadan çıktı. Tekrar konuşmak için /ekle yaz...");
            }
        }
    },
    sendTextMessage: function (userId, text) {
        var conversation = findInChatQueue(userId);
        if (conversation == undefined) {
            messagemanager.sendWelcomeMessage(userId, undefined);
            //messagemanager.sendMessage(userId, "dostum biriyle konuşmak istiyorsan !ekle yaz ve bekle...?");
        } else {
            var sendToId = conversation.first_userId == userId ? conversation.second_userId : conversation.first_userId;
            var senderNick = conversation.first_userId == userId ? conversation.first_nickname : conversation.second_nickname;
            messagemanager.sendMessage(sendToId, senderNick + ": " + text);
        }
    },
    sendAttachment: function (userId, attachments) {
        for (var i = 0; i < attachments.length; i++) {
            console.error("attachments[i].type:" + attachments[i].type);
            switch (attachments[i].type) {
                case 'audio':
                case 'file':
                case 'image':
                case 'video':
                    var conversation = findInChatQueue(userId);
                    if (conversation == undefined) {
                        messagemanager.sendMessage(userId, "dostum biriyle konuşmak istiyorsan !ekle yaz ve bekle...?");
                    } else {
                        var sendToId = conversation.first_userId == userId ? conversation.second_userId : conversation.first_userId;
                        var senderNick = conversation.first_userId == userId ? conversation.first_nickname : conversation.second_nickname;
                        messagemanager.sendAttachment(sendToId, attachments[i].type, attachments[i].payload.url);
                        //messagemanager.sendMessage(sendToId, senderNick + ": " + text);
                    }
                    break;
                default:
                    messagemanager.sendMessage(userId, "dostum ne gönderdiysen biz onu karşıya gönderemedik. sıçtık.");
                    break;
            }
        }

    },
    addToWaiting: function (userId) {
        var findedInQueue = false;
        for (var i = 0; i < waitingUsersQueue.length; i++) {
            if (waitingUsersQueue[i].userId == userId) {
                findedInQueue = true;
                break;
            }
        }
        if (findedInQueue == false) {
            module.exports.addToQueue(userId);
        } else {
            messagemanager.sendMessage(userId, "Dostum biraz beklettik biliyoruz ancak henüz kimse yok. ilk gelenle seni eşleştiricez emin olabilirsin...");
        }
    },
    addToQueue: function (userId) {
        var match = chatQueue.pop();
        if (match == undefined) {
            console.log("match bulunmadı");
            messagemanager.sendMessage(userId, "Biraz bekle adam bulamadık");
            waitingUsersQueue.push(new user(_nicknamemanager.getNickName(), userId, moment(new Date())));
        } else {
            console.log("match bulundu. 1-UserID:'%d' 2-UserID:'%d'", userId, match.userId);
            messagemanager.sendMessage(userId, "Adam bulduk chat başlıcak");
            messagemanager.sendMessage(match.userId, "Adam bulduk chat başlıcak");
        }
    }
};

function findInChatQueue(userId){
    console.log("findInChat quueue");
    for(var i = 0; i < chatQueue.length; i++){
        console.log("findInChat quueue FOR");
        if(chatQueue[i].first_user.userId == userId || chatQueue[i].second_user.userId == userId){
            return chatQueue[i];
        }
    }
    console.log("findInChat quueue UNDEFINED");
    return undefined;
}

function removeFromChatQueue(userId){
    for(var i = 0; i < chatQueue.length; i++){
        if(chatQueue[i].first_userId == userId || chatQueue[i].second_userId == userId){
            chatQueue.splice(i,1);
        }
    }
}