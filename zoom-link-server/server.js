const express = require('express');
const bodyParser= require('body-parser')
const app = express();
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const { json } = require('express');
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });
app.get('/', function(req, res) {
    res.send('Hello World')
  })

  app.listen(PORT, HOST) 
  
console.log(`Running on http://${HOST}:${PORT}`);


app.post('/contacts', async (req, res) => {
    console.log(req.body)

    MongoClient.connect('mongodb+srv://russ-admin:cooperman@cluster0.gqxah.mongodb.net/ZOOM?retryWrites=true&w=majority', (err, client) => {
        if (err) throw err;

        const db = client.db('ZOOM')
        const contactsCollection = db.collection('ZOOM-LINKS')

        contactsCollection.insertOne(req.body).then( insertedRes=>
            {
                console.log('added the following item ', insertedRes.ops[0])
                res.send(insertedRes.ops[0])
            })
    
      }) 
      //res.send(req.body)
  })


app.get('/contacts', async (req, res) => {

    MongoClient.connect('mongodb+srv://russ-admin:cooperman@cluster0.gqxah.mongodb.net/ZOOM?retryWrites=true&w=majority', (err, client) => {
        const db = client.db('ZOOM')
        const contactsCollection = db.collection('ZOOM-LINKS')

        if (err) throw err;

        contactsCollection.find().toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            client.close()  
        });

      }) 
  })

app.delete('/contacts/:id', (req, res) => {
    var mongodb = require('mongodb');
    MongoClient.connect('mongodb+srv://russ-admin:cooperman@cluster0.gqxah.mongodb.net/ZOOM?retryWrites=true&w=majority', (err, client) => {
        const db = client.db('ZOOM')
        const contactsCollection = db.collection('ZOOM-LINKS')
        console.log('asking to delete', req.params.id)
        if (err) throw err;

        contactsCollection.deleteOne(
            { _id : new mongodb.ObjectID( req.params.id) }
            )
        .then(result => {
            console.log('deleted ' , req.params.id)
            client.close()
        })
        .catch(error => console.error(error))
      }) 
      res.send('')
  })