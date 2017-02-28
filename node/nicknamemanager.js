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

        console.log("Loading completed!")

    },
    getNickName: function () {
        console.log("nickList Size: %d", nickList.length)
        var randomIndex =parseInt(Math.random() * (nickList.length - 0) + 0);
        console.log("Random Nick:'"+nickList[randomIndex]+"' Index:'"+randomIndex+"'");
        return nickList[randomIndex];
    }
}