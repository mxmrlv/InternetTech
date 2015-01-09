var Hujidynamicserver       = require("./server/hujidynamicserver"),
    path                    = require('path'),
    StaticRequestHandler    = require('./handlers/staticRequestHandler'),
    serverSettings          = require('./settings/settings'),
    EventEmitter            = require("events").EventEmitter;

/**
 * Starts up the webServer with the specified port and the callback function
 * @param port the post assigned to the webserver.
 * @param callback the callback function to be called with the err upon any error events or with undefined (when no
 *        error occurred)
 */
exports.start = function(port, callback) {
    var hujiEventEmiiter = new EventEmitter();
    var server = new Hujidynamicserver(hujiEventEmiiter);
    server.listen(port);

    hujiEventEmiiter.on(serverSettings.hujiErrors.EADDRINUSE, function(err){
        callback(err, server)
    });

    callback(undefined, server);
};

/**
 * Provides a build in static webServer support (used as handler) and passed the root folder.
 * @param rootFolderPath the root folder for the static server
 * @returns {*|exports} a handler for the static web server.
 */
exports.static = function(rootFolderPath) {
    return StaticRequestHandler(rootFolderPath);
};
