const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const apiai = require('apiai');
const Parser = require('rss-parser');

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

// call Dialogflow smalltalk agent
server.use('/agent/routing',function(req,res,err) {
    dfRequest(req.body.queryString).then(function(response) {
        var messages = [];
        messages.push({text:response.result.fulfillment.speech});
        res.json({messages:messages});
    })

})

server.use('/trending',function(req,res,err) {
    var parser = new Parser({});
    parser.parseURL('https://trends.google.com/trends/hottrends/atom/feed?pn=p28', function(err,feed) {
        if (err) {
            res.json(err);
        }
        else {
            console.log(feed.items);
            var messages = [];
            feed.items.forEach(function(item,index) {
                console.log('forEach ===>',item,index);
                if (index < 5) {
                    if (item.title!='') {
                        messages.push({text:item.title});
                    }
                    if (item.content!='') {
                        messages.push({text:item.content});
                    }
                    if (item.contentSnippet!='') {
                        messages.push({text:item.contentSnippet});
                    }
                }
                else return;
            });
            if (messages.length >= 10) {
                messages = messages.slice(8);
            }
            var jsonResponse = {messages:messages};
            res.json(jsonResponse);
        }
    })
})

server.listen((process.env.PORT || 3001),function() {
    console.log('mot-bao server is listening on 3001...');
})
