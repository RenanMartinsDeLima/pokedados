const { MongoClient } = require('mongodb');

async function connectClient() {
  const uri = 'mongodb://localhost:27017/';
  const client = new MongoClient(uri);
  return client;
}

// CREATE
async function createPokemon(document) {
  const client = await connectClient();
  try {
    const database = client.db('pokedex');
    const pokemons = database.collection('pokemons');
    const pokemon = await pokemons.insertOne(document);
//     const pokemon = await pokemons.insertMany([
//   {
//     nome: 'mudkip',
//     tipo: 'agua'
//   },
//   {
//     nome: 'squirtle',
//     tipo: 'agua'
//   },
//   {
//     nome: 'pikachu',
//     tipo: 'eletrico'
//   },
//   {
//     nome: 'torchic',
//     tipo: 'fogo'
//   },
//   {
//     nome: 'charmander',
//     tipo: 'fogo'
//   },
//   {
//     nome: 'treecko',
//     tipo: 'grama'
//   },
//   {
//     nome: 'bulbasaur',
//     tipo: 'grama'
//   }
// ]);
    console.log(pokemon);
  } finally {
    await client.close();
  }
}

// READ
async function readPokemon() {
  const client = await connectClient();
  try {
    const database = client.db('pokedex');
    const pokemons = database.collection('pokemons');
    // const pokemon = await pokemons.find().toArray();
    // const pokemon = await pokemons.find({}, {name: true, _id: false}).toArray();
    return await pokemons.find({}).sort({tipo:1}).toArray();
    // const pokemon = await pokemons.find({ weight: { $gt: 22 } }).toArray(); // weight > 22
    // const pokemon = await pokemons.find({ weight: { $lte: 25 } }).toArray();  // weight <= 25
    console.log(pokemon);
  } finally {
    await client.close();
  }
}

// UPDATE
async function updatePokemon() {
  const client = await connectClient();
  try {
    const database = client.db('pokedex');
    const pokemons = database.collection('pokemons');
    // const pokemon = await pokemons.updateOne({name:''}, {$set:{name:''}});
    const pokemon = await pokemons.updateMany({nome: 'pikachu'}, {$set:{tipo: 'eletrico'}});
    console.log(pokemon);
  } finally {
    await client.close();
  }
}

// DELETE
async function deletePokemon() {
  const client = await connectClient();
  try {
    const database = client.db('pokedex');
    const pokemons = database.collection('pokemons');
    // const pokemon = await pokemons.deleteOne({name:''});
    // const pokemon = await pokemons.deleteMany({weight: {$lt: 21}});
    const pokemon = await pokemons.deleteMany({});
    console.log(pokemon);
  } finally {
    await client.close();
  }
}


module.exports = {
  createPokemon,
  readPokemon,
  updatePokemon,
  deletePokemon,
}
