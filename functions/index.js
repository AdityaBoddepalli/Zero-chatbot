const functions = require("firebase-functions");
const admin = require('firebase-admin');
var serviceAccount = require("./service-account.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pa-chatbot-default-rtdb.firebaseio.com/"
});
const { WebhookClient } = require('dialogflow-fulfillment');

exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });

    const result = request.body.queryResult;


    async function contactme(agent) {

     const db = admin.database();
     const name = result.parameters.name;
     const email = result.parameters.email;
     const text = result.parameters.text;

      await db.ref('data').push({
        name: name,
        email: email,
        text: text
    })
      agent.add(`Thank you for sending a message, Aditya will get back to you.`);
    }


    let intentMap = new Map();
    intentMap.set('Talk to Adi', contactme);
    agent.handleRequest(intentMap);
});