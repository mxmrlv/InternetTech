/**
 * Created by Tom on 14/12/2014.
 */

var CRLF = '\r\n';

exports.parse = function (str, HttpRequestObject) {
    var httpRequestObject = new HttpRequestObject();
    httpRequestObject['body'] =  str.substr(str.indexOf(CRLF + CRLF) , str.length).trim();
    str.replace(str.indexOf(CRLF + CRLF), httpRequestObject['body'].length,"");

    var text_content = str.split(CRLF);
    var type = text_content[0].trim();
    var type_content = type.split(' ');
    httpRequestObject['type'] = {};
    httpRequestObject['type']['method'] = type_content[0].trim();
    httpRequestObject['type']['path'] = type_content[1].trim();
    httpRequestObject['type']['version'] = type_content[2].trim();

    delete text_content[0];

    httpRequestObject['headers'] = {};

    for (var index in text_content){
        var line = text_content[index].trim();
        if (line != '')
            httpRequestObject['headers'][line.substr(0, line.indexOf(':')).trim()] = line.substr(line.indexOf(':') + 1).trim();
    }
    return httpRequestObject;
};

exports.stringify = function (httpResponseObject) {
    var str_to_return = "";

    str_to_return += httpResponseObject['type'] + CRLF;
    for (var key in httpResponseObject['headers']){
        str_to_return += key + ":" + httpResponseObject['headers'][key] + CRLF;
    }
    //str_to_return += CRLF + httpResponseObject['body'];
    return str_to_return + CRLF;
};