'use strict'

var express = require('express');
var CategoryController = require('../controllers/categoriaController');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

//api.get('/pruebaCategory', CategoryController.pruebacategory);

api.post('/guardarCategoria', CategoryController.saveCategory);

api.get('/listarCategorias',  CategoryController.listarCategory);

api.put('/elimnarCategoria/:id', CategoryController.deleteCategory);

api.put('/modificarCategoria/:id', CategoryController.updateCategory);

module.exports = api;

