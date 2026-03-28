const { createPokemon, readPokemon, updatePokemon, deletePokemon } = require('../models/pokemonModel')
// const express = require('express');

// POST 
const create = async (req, res) => {
  try {
    console.log(req.body);
    const pokemon = await createPokemon(req.body);
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
};

// GET 
const get = async (req, res) => {
  try {
    const list = await readPokemon(null, null);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
};


// const getByName = async (req, res) => {
//   try {
//     console.log(req.params.nome)
//     const list = await readPokemon(req.params.nome);
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
//   }
// };


// const getByID = async (req, res) => {
//   try {
//     console.log(req.params.id)
//     const list = await readPokemon(req.params.id);
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
//   }
// };

const getBy = async (req, res) => {
  try {
    const valor = req.params.valor;
    let atributo;
    if (req.path.includes('/id/')) {
      atributo = 'id';
    } else if (req.path.includes('/nivel/')) {
      atributo = 'nivel';
    } else if (req.path.includes('/nome/')) {
      atributo = 'nome';
    } else if (req.path.includes('/tipo/')) {
      atributo = 'tipo';
    }
    const result = await readPokemon(atributo, valor);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
};

// PUT 
const update = async (req, res) => {
  try {
    console.log(req.params);
    const pokemon = await updatePokemon(req.params.id, req.params.nivel);
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
};

// DELETE 
const remove = async (req, res) => {
  try {
    const pokemon = await deletePokemon(req.params.id);
    console.log(pokemon)
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
};


const removeAll = async (req, res) => {
  try {
    const pokemon = await deletePokemon(null);
    console.log(pokemon)
    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pokémons\n' + err.message });
  }
};


module.exports = {
    get,
    getBy,
    // getByName,
    // getByID,
    create,
    update,
    remove,
    removeAll,
};


