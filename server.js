'use strict';

var AlexaServer = require( 'alexa-app-server' );

var server = new AlexaServer( {
 httpsEnabled: false,
 port: process.env.PORT || 80
} );

server.start();