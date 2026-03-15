const { MongoClient } = require('mongodb');

async function runGetStarted() {
  // Replace the uri string with your connection string
  const uri = 'mongodb://localhost:27017/';
  const client = new MongoClient(uri);

  try {
    const database = client.db('pokedex');
    const pokemons = database.collection('pokemons');

    // Queries for a movie that has a title value of 'Back to the Future'
    // const query = { nome: 'pikachu' };
    const pokemon = await pokemons.find({}).toArray();
    console.log(pokemon);
  } finally {
    await client.close();
  }
}
runGetStarted().catch(console.dir);
