const express = require('express');
const cors = require('cors');
// const { MongoClient } = require('mongodb');
// const { createPokemon, readPokemon } = require('./mongo')
const routePokemon = require('./routes/pokemonRoutes')

const app = express();
const PORT = 3000;

app.use(express.json(), cors());
app.use('/pokemon', routePokemon);


app.listen(PORT, () => { 
  console.log(`server na ${PORT}`) 
});


module.exports = app;


