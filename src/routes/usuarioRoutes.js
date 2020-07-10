'use strict'

var express = require('express');
var UserController = require('../controllers/usuarioController');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

//api.get('/pruebaUser', UserController.pruebaUser);

api.post('/login', UserController.loginUser);

//CRUD
api.post('/guardarUser', UserController.guardarUser);

api.get('/listarUser', UserController.listUser);

api.put('/eliminarUser/:id',md_auth.ensureAut, UserController.deleteUser);

api.put('/modificarUser/:id',md_auth.ensureAut, UserController.updateUser);

//COSAS X

api.post('/agregarCarrito',md_auth.ensureAut, UserController.addCartProduct);

module.exports = api;