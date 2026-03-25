const { createPokemon, readPokemon, updatePokemon, deletePokemon } = require('../mongo')
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const pokemon = await createPokemon(req.body);
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const pokemon = await readPokemon();
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
});


router.put('/', async (req, res) => {
  try {
    console.log(req.body);
    const pokemon = await updatePokemon(req.body);
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
});


router.delete('/', async (req, res) => {
  try {
    const pokemon = await deletePokemon();
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
});


module.exports = router;


