/**
 * Created by ayberk on 02.01.2017.
 */
// create a unique, global symbol name
// -----------------------------------
var localize = require ("localize");

const LOCALIZE_KEY = Symbol.for("My.justtalk.localizemanager");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasKey = (globalSymbols.indexOf(LOCALIZE_KEY) > -1);

if (!hasKey){
    global[LOCALIZE_KEY] = {
        localizeObject : new localize('./localize/')
    };
}

// define the singleton API
// ------------------------

var singleton = {};

Object.defineProperty(singleton, "instance", {
    get: function(){
        return global[LOCALIZE_KEY];
    }
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton;