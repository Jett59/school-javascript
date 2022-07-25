import mongodb from 'mongodb';

const connectionString = 'mongodb://localhost:27017';
const mongoConnection = mongodb.MongoClient.connect(connectionString, { useNewUrlParser: true });
const db = mongoConnection.then(client => client.db('notes-database'));
const loginsCollection = db.then(db => db.collection('logins'));
const notesCollection = db.then(db => db.collection('notes'));

// Since creating the indexes multiple times doesn't hurt we just create them every time we connect to the database.
// The only queries so far are using the username.
loginsCollection.then(logins => logins.createIndex({ "username": 1 }));
notesCollection.then(notes => notes.createIndex({ "username": 1 }));

export function getLogin(username) {
    return loginsCollection.then(logins => logins.findOne({ "username": username }));
}

export function addLogin(login) {
    return loginsCollection.then(logins => logins.insertOne(login));
}

export function getNotes(username) {
    return notesCollection.then(notes => notes.find({ "username": username }).toArray());
}

export function createNote(username, title) {
    return notesCollection.then(notes => notes.insertOne({ "title": title, "username": username, "content": "" })).then(response => response.insertedId);
}

export function deleteNote(username, id) {
    return notesCollection.then(notes => notes.deleteOne({ "_id": new mongodb.ObjectId(id), "username": username }));
}

export function getNote(username, id) {
    return notesCollection.then(notes => notes.findOne({ "_id": new mongodb.ObjectId(id), "username": username }));
}

export function updateNote(username, id, newTitle, newContent) {
    return notesCollection.then(notes => notes.updateOne({ "_id": new mongodb.ObjectId(id), "username": username }, { $set: { "title": newTitle, "content": newContent } }));
}
