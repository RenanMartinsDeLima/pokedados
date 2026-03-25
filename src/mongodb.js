const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);

let db;

async function connectMongo() {
  if (!db) {
    await client.connect();
    db = client.db('pokedex')
    console.log('MongoDB conectado')
  }
  return db;
}


module.exports = connectMongo;
