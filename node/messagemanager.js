/**
 * Created by ayberk on 30.12.2016.
 */
request = require('request');
var constants = require("./constants");


module.exports = {
    sendMessage: function (userdId, messageText) {
        var messageData = {
            recipient: {
                id: userdId
            },
            message: {
                text: messageText,
                metadata: "DEVELOPER_DEFINED_METADATA"
            }
        };

        module.exports.callSendAPI(messageData);
    },
    sendAttachment: function (userId, type, payloadUrl) {
        var messageData = {
            recipient: {
                id: userId
            },
            message: {
                attachment: {
                    type: type,
                    payload: {
                        url: payloadUrl
                    }
                }
            }
        };
        console.log(messageData);
        module.exports.callSendAPI(messageData);
    },
    callSendAPI: function (messageData) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: constants.PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

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
}
