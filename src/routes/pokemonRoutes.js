// const { createPokemon, readPokemon, updatePokemon, deletePokemon } = require('../models/pokemonModel')
const controller = require('../controllers/pokemonController')
const express = require('express');
const router = express.Router();


router.post('/', controller.create);

router.get('/id/:valor', controller.getBy);

router.get('/nivel/:valor', controller.getBy);

router.get('/nome/:valor', controller.getBy);

router.get('/tipo/:valor', controller.getBy);

router.put('/:id/:nivel', controller.update);

router.delete('/:id', controller.remove);

router.delete('/', controller.removeAll);


module.exports = router;


