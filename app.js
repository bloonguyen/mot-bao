const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const server = express();

const projectId = "small-talk-2-8260e"; //small talk agent Id
const sessionId = 'quickstart-session-id';
var gcloud = require('google-cloud')({
  projectId: projectId,

  // The path to your key file:
  keyFilename: './motBao-73970225caf1.json'
});


const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();


const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const request = function(text) {
    return {
        session: sessionPath,
        queryInput: {
            text: {
                text: text()
            }
        }
    }
}

server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());
server.use(morgan('combined'));

server.use('/agent/routing',function(req,res,err) {
    console.log('req content ====> ',req.body);

    sessionClient.detectIntent(() => req.body.queryString)
        .then(responses => {
            const result = responses[0].queryResult;
            console.log(`  Query: ${result.queryText}`);
            console.log(`  Response: ${result.fulfillmentText}`);
            if (result.intent) {
              console.log(`  Intent: ${result.intent.displayName}`);
            } else {
              console.log(`  No intent matched.`);
            }
        })
    res.json(responses);
})

server.listen((process.env.PORT || 3001),function() {
    console.log('mot-bao server is listening on 3001...');
})
