/**
 * Created by ayberk on 27.02.2017.
 */

var constants = require("./constants");

var reader = require ("buffered-reader");
var BinaryReader = reader.BinaryReader;
var DataReader = reader.DataReader

var nickList = [];
module.exports = {
    loadNickNames : function () {
        console.log("Start loading nicknames");

        var close = function (binaryReader, error){
            if (error) console.log (error);
            console.log("Nicknames loaded!");

            binaryReader.close (function (error){
                if (error) console.log (error);
            });
        };
        new DataReader (constants.NICKNAME_FILE_NAME, { encoding: "utf8" })
            .on ("error", function (error){
                console.log (error);
            })
            .on ("line", function (line, nextByteOffset){
                nickList.push(line);
                //if (line === "Phasellus ultrices ligula sed odio ultricies egestas."){
                //    offset = nextByteOffset;
                //    this.interrupt ();
                //}
            })
            .on ("end", function (){
                new BinaryReader (file)
                    .seek (offset, function (error){
                        if (error) return close (this, error);

                        this.read (9, function (error, bytes, bytesRead){
                            if (error) return close (this, error);

                            console.log (bytes.toString ()); //Prints: Curabitur

                            close (this);
                        });
                    });
            })
            .read ();

    },
    getNickName : function () {
        var randomIndex = Math.random() * (nickList.size - 0) + 0;
        return nickList[randomIndex];
    }
}
