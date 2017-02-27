/**
 * Created by ayberk on 02.01.2017.
 */

var _localize = require ("localize");

module.exports = {
    localize: function (message, lang) {
        if(lang == undefined)
            lang = "tr";

        var localize = new _localize('./translations/', undefined, "tr");
        localize.setLocale(lang);
        return localize.translate(message);

    }
}