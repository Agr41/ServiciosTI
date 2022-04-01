const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


const dbName = 'loginDB';

module.exports = {client, dbName}; 