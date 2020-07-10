'use strict'

const express = require('express');
const ProductController = require('../controllers/productoControlle');
var api = express.Router();

//api.get('/pruebaProduct', ProductController.pruebaproducto);

api.post('/guardarProducto', ProductController.saveProduct);

api.put('/eliminarproducto/:id', ProductController.deleteProduct);

api.put('/modificarPrducto/:id', ProductController.updateProduct);

api.get('/listarProductos',  ProductController.listProduct);

api.get('/masVendido',  ProductController.masVendido);

module.exports = api;