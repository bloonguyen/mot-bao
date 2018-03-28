const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const server = express();

server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(morgan('combined'));

server.use('/agent/routing',function(req,res,err) {
    res.json()
})

server.listen((process.env.PORT || 3001),function() {
    console.log('mot-bao server is listening on 3001...');
})
