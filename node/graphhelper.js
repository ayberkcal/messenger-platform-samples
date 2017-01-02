/**
 * Created by ayberk on 02.01.2017.
 */
const request = require('request'),
constants = require("./constants");

module.exports = {
    getUserInfo: function(userId){
        console.log("getUserInfo called : %d", userId);
        request({
            uri: 'https://graph.facebook.com/v2.6/' + userId,
            qs: {access_token: constants.PAGE_ACCESS_TOKEN},
            method: 'GET'
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("body: " + body);
                return body;
                //var recipientId = body.recipient_id;
                //var messageId = body.message_id;

                /*if (messageId) {
                 console.log("Successfully sent message with id %s to recipient %s",
                 messageId, recipientId);
                 } else {
                 console.log("Successfully called Send API for recipient %s",
                 recipientId);
                 }*/
            } else {
                console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
            }
        });
    }
};