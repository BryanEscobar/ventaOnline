'use strict'

var express = require('express');
var BillController = require('../controllers/cuentaController');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();



api.get('/facturar/:id', BillController.agregarCuenta);

api.get('/list-bill', BillController.listBill);

module.exports = api;