const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const apiai = require('apiai');

const server = express();

const df = apiai('291a4a67331449f3b6cf3346f0e361bb');
const projectId = "small-talk-2-8260e"; //small talk agent Id
const sessionId = 'quickstart-session-id';

server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(morgan('combined'));


function dfRequest(query) {
    return new Promise(function(resolve,reject) {
        var request = df.textRequest(query, {
            sessionId: Math.random().toString().slice(2)
        });

        request.on('response', function(response) {
            return resolve(response);
        });

        request.on('error', function(error) {
            return reject(response);
        });

        request.end();
    })
}

server.use('/agent/routing',function(req,res,err) {
    dfRequest(req.body.queryString).then(function(response) {
        var messages = [];
        messages.push({text:response.result.fulfillment.speech});
        res.json({messages:messages});
    })

})

server.listen((process.env.PORT || 3001),function() {
    console.log('mot-bao server is listening on 3001...');
})
