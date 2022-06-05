const mongodb = require('mongodb');

const connectionString = 'mongodb://localhost:27017';
const mongoConnection = mongodb.MongoClient.connect(connectionString, { useNewUrlParser: true });
const db = mongoConnection.then(client => client.db('notes-database'));
const loginsCollection = db.then(db => db.collection('logins'));
const notesCollection = db.then(db => db.collection('notes'));

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
