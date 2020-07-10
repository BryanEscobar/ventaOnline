'use strict'

var User = require('../models/usuario');
var Cuentas = require('../models/cuenta');

function pruebabill(req, res){
    res.status(200).send({message: 'Prueba de bill funciona correctamente'});
}

//=====================================================================GENERAR FACTURA==========================================================

function agregarCuenta(req,res){
    var params = req.body;
    var userID = req.params.id;
    var cuentas = new Cuentas();

    User.findById(userID, function(err,usuarioFacturar){
        if(err){
            res.status(404).send({message: 'Error'});
        }else{
            if(usuarioFacturar){
                cuentas.user = usuarioFacturar.name;
                cuentas.cuenta = usuarioFacturar.cart;
                cuentas.date = Date.now();
                cuentas.save((err, cuentaSave) =>{
                    if(err){
                        res.status(500).send({message: 'No se ha guardado la factura'});
                    }else{
                        if(!cuentaSave){
                            res.status(500).send({message: 'Error al guardar la factura'});
                        }else{
                            usuarioFacturar.cart = [];
                            usuarioFacturar.save().then().catch();
                            res.status(200).send({usuarioFacturar, Cuenta: cuentaSave});
                        }
                    }
                });
            }
        }
    });
}

//=====================================================================LISTAR CUENTA==========================================================

function listBill(req, res){
    var params = req.body;

    Bill.find({}, function(err,Cuenta){
        if(err){
            res.status(404).send({message: 'Error'});
        }
        return res.status(200).send({message:'Listado de facturas', Datos_de_factura: Cuenta});
    });
}


module.exports = {
    pruebabill,
    listBill,
    agregarCuenta
}