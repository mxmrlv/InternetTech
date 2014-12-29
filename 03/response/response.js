var serverSettings  = require('./../settings/settings');

var Response = function (httpVersion, statusCode) {
    this.httpVersion = httpVersion;
    this.statusCode = statusCode;
    this.headers = {};
    this.headers['date'] = new(Date)().toUTCString();
    this.headers['server'] = serverSettings.serverVersion;

};

/**
 * Set header field to value, or pass an object to set multiple fields at once.
 * @param field
 */
Response.prototype.set = function(field, value){
    value = (typeof value === 'undefined') ? 'noValue' : value;
    if (typeof value === 'undefined') {
        if (typeof field === 'object') {
            for (var key in field) {
                Response.headers[key] = field[key];
            }
        }
    }
    else{
        Response.headers[field] = value;
    }
}

/**
 * Set cookie name to value, which may be a string or object converted to JSON. The path option defaults to "/".
 * @param field
 */
Response.prototype.get = function(field){
    return this[field];
}

/**
 * Set cookie name to value, which may be a string or object converted to JSON. The path option defaults to "/".
 *
 * @param name
 * @param value
 * @param options
 */
Response.prototype.cookie = function(name, value, options){
    option = (typeof options === 'undefined') ? 'noOptions' : options;
}

/**
 * This method performs a myriad of useful tasks for simple non-streaming responses such as automatically assigning
 * the Content-Length unless previously defined and providing automatic HEAD and HTTP cache freshness support.
 */
Response.prototype.send = function(body){
    body = (typeof body === 'undefined') ? 'noBody' : body;
}

/**
 * Send a JSON response. This method is identical to res.send() when an object or array is passed. However, it
 * may be used for explicit JSON conversion of non-objects, such as null, undefined, etc. (although these are
 * technically not valid JSON).
 * @param body
 */
Response.prototype.json = function(body){
    body = (typeof body === 'undefined') ? 'noBody' : body;

}

/**
 * Redirect to the given url with optional status code defaulting to 302 "Found".

 */
Response.prototype.status = function(status, url){
    status = (typeof status === 'undefined') ? '302' : status;
}

module.exports = Response;


