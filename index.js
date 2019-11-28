// 'Requires' (gets access to) installed npm packages
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// bodyParser included with 'express'
const bodyParser = require('body-parser');

// Puts 'express' keeps app inside one variable 'app'
const app = express();

// Defines the port / URL
const port = 5000;
const url = 'mongodb://localhost:27017'

// Need this as 'middleman' to allow access to POST data.
var jsonParser = bodyParser.json();

//
var insertDataInDb = (db, dataToSend, callback) => {
    var collection = db.collection('SQBank')
    collection.insertOne(dataToSend, (err, docs) => {
        console.log(docs)
        callback(docs)
    })
}

var getDataFromDb = (db, callback) => {
    var collection = db.collection('SQBank')
    collection.find({}).toArray((err, docs) => {
        console.log('Found the following records...')
        callback(docs)
    })
}

app.post('/SQBank', jsonParser, (req, res) => {
    const newClientName = req.body.name
    const newClientBalance = req.body.balance
    // Create a new object to go into the db.
    const dataToSend = {
        name: newClientName,
        balance: newClientBalance
    }
    // Connects to MongoDB
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        console.log('Connected correctly to MongoDb')
        // Choose which db we want to access.
        let db = client.db('squamates')
        // run a function that adds data to db
        let result = insertDataInDb(db, dataToSend, (docs) => {
            if (docs.insertedCount === 1) {
                res.send('It probably worked!')
            } else {
                res.send('It borked!')
            }
        })
        client.close()
    })
})

// do the 'get' for see all accounts.

app.listen(port, () => console.log(`App is now listening on port ${port}`))