/**
 * Created by ayberk on 27.02.2017.
 */

var constants = require("./constants");

const fs = require("fs");
var split = require('split');

var nickList = [];
module.exports = {
    loadNickNames: function () {
        console.log("Start loading nicknames");

        fs.createReadStream('./' + constants.NICKNAME_FILE_NAME)
            .pipe(split())
            .on('data', function (line) {
                nickList.push(line);
            });

    },
    getNickName: function () {
        var randomIndex = Math.random() * (nickList.size - 0) + 0;
        return nickList[randomIndex];
    }
}