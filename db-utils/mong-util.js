const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://taskapp:nitin123@cluster0.uv3jp.mongodb.net/assignment>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let db;

const connectDB = (cb) => {
    client.connect(err => {
        db = client.db("assignment");
        cb(err)
    });
}

const getDB = () => {
    return db
}

module.exports = { connectDB, getDB }