const mongodb = require('mongodb');

const connectionString = 'mongodb://localhost:27017';
const mongoConnection = mongodb.MongoClient.connect(connectionString, { useNewUrlParser: true });
const db = mongoConnection.then(client => client.db('notes-database'));
const loginsCollection = db.then(db => db.collection('logins'));
const notesCollection = db.then(db => db.collection('notes'));

// Since creating the indexes multiple times doesn't hurt we just create them every time we connect to the database.
// The only queries so far are using the username.
loginsCollection.then(logins => logins.createIndex({ "username": 1 }));
notesCollection.then(notes => notes.createIndex({ "username": 1 }));

function getLogin(username) {
    return loginsCollection.then(logins => logins.findOne({ "username": username }));
}
exports.getLogin = getLogin;

function addLogin(login) {
    return loginsCollection.then(logins => logins.insertOne(login));
}
exports.addLogin = addLogin;

function getNotes(username) {
    return notesCollection.then(notes => notes.find({ "username": username }).toArray());
}
exports.getNotes = getNotes;
