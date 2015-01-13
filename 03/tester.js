var http            = require('http'),
    net             = require('net'),
    serverSetting   = require('./settings/settings'),
    hujiwebserver   = require('./hujiwebserver');

var lport           = 8888;

function generateOptions(host, port, path, method, connection) {
    return {
        host: host,
        port: port,
        path: path,
        method: method,
        headers : {Connection: connection}
    }
}

function basicCookieTest(callback){
    console.log("Basic static cookie test <basicCookieTest> began");
    var options = generateOptions('localhost', lport, '/root/test.html', 'GET', 'close');
    options.headers['Cookie'] = 'name=tom; id=123';
    http.get(options, function (response) {
        response.on('data', function (dat) {
            if (response.statusCode === 200 && response.headers['set-cookie'][0].substr('name=tom') != -1 &&
            response.headers['set-cookie'][1].substr('id=123') != -1) {
                console.log('basicCookieTest passed!!');
                next(callback);
            } else {
                if (response.statusCode !== 200)
                    console.log('basicCookieTest failed. expected : 200 |  actual :' + response.statusCode);
                else{
                    console.log('The cookie failed to arrive');
                }
            }
        });
        response.on('error', function (error) {
            console.log('Error running basicCookieTest. ' + error);
        });
    });
}

function basicStaticTest(callback) {
    console.log("Basic static request <basicStaticTest> began");
    var options = generateOptions('localhost', lport, '/root/test.html', 'GET', 'close');
    options.headers['Cookie'] = 'name=tom; id=123';
    http.get(options, function (response) {
        response.on('data', function () {
            if (response.statusCode === 200) {
                console.log('basicStaticTest passed!!');
                next(callback);
            } else {
                console.log('basicStaticTest failed. expected : 200 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running basicStaticTest. ' + error);
        });
    });
}

function basicStaticNonExistingFileTest(callback) {
    console.log("A basic non existing file request <basicStaticNonExistingFileTest> began");

    var options = generateOptions('localhost', lport, '/root/noFile.html', 'GET', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode === 404) {
                console.log('basicStaticNonExistingFileTest passed!!');
                next(callback);
            } else {
                console.log('basicStaticNonExistingFileTest failed. expected : 404 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running basicStaticNonExistingFileTest. ' + error);
        });
    });
}

function basicStaticServerStopTest(callback) {
    console.log("Basic server stop test <basicStaticServerStopTest> began");
    var options = generateOptions('localhost', lport, '/root/noFile.html', 'GET', 'close');
    http.get(options, function (response) {

    }).on('error', function (e) {
        if (e.code === 'ECONNREFUSED') {
            console.log('basicStaticServerStopTest passed!!');
            next(callback);
        } else {
            console.log('basicStaticServerStopTest did not manage to stop the server');
        }
    });
}

function basicServerShutdown(callback) {
    console.log("Basic server stop test <basicStaticServerStopTest> began");
    var options = generateOptions('localhost', lport, '/root/noFile.html', 'GET', 'close');
    http.get(options, function (response) {

    }).on('error', function(e){
        if (e.code === 'ECONNREFUSED') {
            console.log('basicStaticServerStopTest passed!!');
            next(callback);
        } else {
            console.log('basicStaticServerStopTest did not manage to stop the server');
        }
    });
}

/**
 * Testing Non HTTP format.
 */
function basicStaticNonHttpFormatTest(callback) {
    console.log("Testing a non http request format <basicStaticNonHttpFormatTest> began");

    var message = 'bla bla blaa';
    var conn = net.createConnection(lport);
    conn.write(message);
    conn.on('data', function (data) {
        if (data.toString().indexOf('500') !== -1) {
            console.log('basicStaticNonHttpFormatTest passed!!');
            next(callback);
        } else {
            console.log("basicStaticNonHttpFormatTest didn't get status 500.");
        }
    });
}

function basicStaticHeadTest(callback) {
    console.log("Server receives a HEAD request <basicStaticPostTest> began");
    var headOptions = generateOptions('localhost', lport, '/root/test.html', 'HEAD', 'close');
    var bodySize = 0;

    var req = http.request(headOptions, function (headResponse) {
        headResponse.on('data', function (chunk) {
            bodySize += chunk.length;
        });
        headResponse.on('end', function () {
            if (bodySize === 0 && headResponse.statusCode === 200 && headResponse.headers['Content-length'] !== '0') {
                console.log('basicStaticHeadTest passed!!');
                next(callback);
            } else {
                console.log("basicStaticHeadTest didn't get status 200.");
            }
        })
    });
    req.end();
}

function basicRecordHandlerURITest(callback) {
    console.log("Getting a response to the query basic handler <basicRecordHandlerURITest> began");
    var options = generateOptions('localhost', lport, '/root/tests/json_file?name=tom', 'GET', 'close');
    http.get(options, function (response) {
        var buffer = "";
        response.on('data', function (data) {
            buffer += data;
        });
        response.on('error', function (error) {
            console.log('Error running basicRecordHandlerURITest. ' + error);
        });
        response.on('end', function () {
            if (response.statusCode === 200 && buffer.indexOf('"name":"tom"') !== -1) {
                console.log('basicRecordHandlerURITest passed!!');
                next(callback);
            } else {
                if (response.statusCode !== 200) {
                    console.log('basicRecordHandlerURITest failed. expected : 200 |  actual :' + response.statusCode);
                } else {
                    console.log("The records wasn't found at all");
                }
            }
        })
    });
}

function basicRecordHandlerBodyTest(callback) {
    console.log("Getting a response to the query basic handler <basicRecordHandlerBodyTest> began");
    var options = generateOptions('localhost', lport, '/root/tests/json_file?name=tom', 'POST', 'close');
    var bodyQuery = 'name=maxim';
    var queryResponse = '"name":"maxim"';
    options.headers['Content-length'] = bodyQuery.length;
    options.headers['Content-type'] = 'application/x-www-form-urlencoded';
    var req = http.request(options, function (response) {
        var body = "";
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('error', function (error) {
            console.log('Error running basicRecordHandlerURITest. ' + error);
        });
        response.on('end', function(){
            if (response.statusCode === 200 && body.indexOf(queryResponse) !== -1) {
                console.log('basicRecordHandlerURITest passed!!');
                next(callback);
            } else {
                if (response.statusCode !== 200) {
                    console.log('basicRecordHandlerURITest failed. expected : 200 |  actual :' + response.statusCode);
                } else {
                    console.log("The records wasn't found at all");
                }
            }
        })
    });

    req.write(bodyQuery+serverSetting.CRLF);
    req.end();

}

function getAndPostCrossTest(callback) {
    console.log("Server is up ont GET request and a receives POST request <getAndPostCrossTest> began");

    var options = generateOptions('localhost', lport, '/root/test.html', 'POST', 'close');
    var req = http.request(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode === 404) {
                console.log('getAndPostCrossTest passed!!');
                next(callback);
            } else {
                console.log('getAndPostCrossTest failed. expected : 404 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running getAndPostCrossTest. ' + error);
        });
    });
    req.end();
}

function postAndGetCrossTest(callback) {
    console.log("Server is up ont POST request and receives a GET request <postAndGetCrossTest> began");

    var options = generateOptions('localhost', lport, '/root/test.html', 'GET', 'close');
    var req = http.get(options, function (response) {
        response.on('data', function () {
            if (response.statusCode === 404) {
                console.log('postAndGetCrossTest passed!!');
                next(callback);
            } else {
                console.log('postAndGetCrossTest failed. expected : 404 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running postAndGetCrossTest. ' + error);
        });
    });
    req.end();
}

function testSuite1(callback) {
    printSuiteStart('suite 1')

    hujiwebserver.start(lport, function (e, server) {

        if (e) {
            console.log(e);
        } else {
            var myUseStr = hujiwebserver.myUse().toString();
            if (myUseStr === undefined || myUseStr === '') {
                console.log("The toString for myUse failed")
            }
            else {
                console.log("The toString for myUse passed!!\nAnd it's:\n"+myUseStr+"\n~~~~~~~~~~~~~~~");
                server.use('/root', hujiwebserver.myUse());
                server.use('/root', hujiwebserver.static('/tests/'));

                function stopServerAndTest(callback) {
                    server.stop(function () {
                        basicStaticServerStopTest(callback)
                    });
                }

                var orderedTesters = [
                    basicStaticTest,
                    basicStaticNonExistingFileTest,
                    basicStaticNonHttpFormatTest,
                    basicStaticHeadTest,
                    basicCookieTest,
                    stopServerAndTest,
                    callback
                ];
                var first = testSequence(orderedTesters);
                first();
            }
        }
    });
}

function testSuite2(callback){
    printSuiteStart('suite 2')

    hujiwebserver.start(lport, function (e, server) {
        if (e) {
            console.log(e);
        } else {
            server.post('/root', hujiwebserver.static('/tests/'));
            function stopServerAndTest(callback) {
                server.stop(function () {
                    basicStaticServerStopTest(callback);
                });
            }
            var orderedTesters = [
                postAndGetCrossTest,
                stopServerAndTest,
                callback
            ];
            var first = testSequence(orderedTesters);
            first();
        }
    });
}

function testSuite3(callback) {
    printSuiteStart('suite 3')

    hujiwebserver.start(lport, function (e, server) {
        if (e) {
            console.log(e);
        } else {
            server.get('/root', hujiwebserver.static('/tests/'));
            function stopServerAndTest(callback) {
                server.stop(function () {
                    basicStaticServerStopTest(callback);
                });
            }
            var orderedTesters = [
                getAndPostCrossTest,
                stopServerAndTest,
                callback
            ];
            var first = testSequence(orderedTesters);
            first();
        }
    });
}

function testSuite4(callback) {
    printSuiteStart('suite 4')

    hujiwebserver.start(lport, function (e, server) {
        if (e) {
            console.log(e);
        } else {
            server.use('/root', hujiwebserver.recordsHandler());
            function stopServerAndTest(callback){
                server.stop(function () {
                    basicServerShutdown(callback);
                });
            }
            var orderedTesters = [
                basicRecordHandlerURITest,
                basicRecordHandlerBodyTest,
                stopServerAndTest,
                callback
            ];
            var firstFunc = testSequence(orderedTesters);
            firstFunc();
        }
    });
}

function next(callback) {
    if (callback !== undefined) {
        callback();
    } else {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("Testing was finished and all tests passed");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
}

function printSuiteStart(suite){
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~Starting ' + suite + ' tests~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
}

function testSequence(funcs) {
    for (var i = funcs.length - 1 ; i > 0  ; --i) {
        funcs[i - 1] = funcs[i - 1].bind(funcs[i -1], funcs[i]);
    }
    return funcs[0];
}

//TESTING SUITES - the order between them doesn't really matter.
var firstFunc = testSequence([testSuite1, testSuite2, testSuite3, testSuite4]);

firstFunc();
