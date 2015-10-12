'use strict';

var http = require('http');

var StaticServer = require('node-static').Server;

function echo(request, response) {
  var data = {
    ip: request.connection.remoteAddress,
    method: request.method,
    url: request.url,
    body: '',
    headers: request.headers
  };

  request.on('data', function(buffer) {
    data.body += buffer.toString();
  });

  request.on('end', function() {
    var body = JSON.stringify(data, null, 2);
    response.setHeader('Content-Type', 'application/json');
    response.end(body);
  });
}

function error(response) {
  response.statusCode = 500;
  response.end('500 SERVER ERROR');
}

function crash(response) {
  response.statusCode = 500;
  response.socket.destroy();
}

function createServer() {
  var file = new StaticServer(__dirname + '/public');

  return http.createServer(function(request, response) {
    switch (request.url) {
    case '/echo':
      return echo(request, response);

    case '/error':
      return error(response);

    case '/crash':
      return crash(response);

    case '/blackhole':
      return;
    }

    var listener = request.addListener('end', function() {
      file.serve(request, response);
    });
    listener.resume();
  });
}

var testApp = module.exports = {
  listen: function(port, callback) {
    this.server = createServer();
    this.server.listen(port, callback);
  },

  kill: function(callback) {
    this.server.close(callback);
    this.server = null;
  }
};

if (module === require.main) {
  if (process.env.never_listen) {
    console.log('Refusing to listen')
    setTimeout(function() {}, 100000);
  } else {
    testApp.listen(process.env.PORT || 4003, function() {
      console.log('Listening on port %j', this.address().port);
    });
  }
}