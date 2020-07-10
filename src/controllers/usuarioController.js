'use strict'

var User = require('../models/usuario');
var Product = require('../models/producto');
var Bill = require('../models/cuenta');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function pruebaUser(req, res){
    res.status(200).send({message: 'Prueba del controlador de users funciona correctamente'})
}

//=*************************************************************GUARDAR =*************************************************************

function guardarUser(req, res){
    var user =  new User();
    var params = req.body;

    if(params.password && params.name && params.surname && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = "ROLE_CLIENTE"

        User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
        if(err){
            res.status(500).send({message: 'Error al iniciar sesión'});
            }else{
                if(!issetUser){
                    bcrypt.hash(params.password, null, null, function (err,hash){
                        user.password = hash;
                        user.save((err, userAlmacenado) => {
                            if(err){
                                res.status(500).send({ message: 'Error al guardar el usuario'});
                            }else{
                                if(!userAlmacenado){
                                    res.status(404).send({message: 'No se ha podido registrar el usuario'});
                                }else{
                                    res.status(200).send({user:userAlmacenado});
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({message: 'El usuario ya se ha registrado anteriormente con la misma dirección de correo'});
                }
            }    
        });

 }else{
     res-status(200).send({message: 'Ingresa los datos correctamente'})
 }
}

//=*************************************************************LOGIN =*************************************************************
function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err,user)=>{
    if(err){
        res.status(500).send({message: 'Error al Intentar Iniciar Sesion'});
    }else{
        if(user){
            bcrypt.compare(password, user.password, (err, check) =>{
                if(check){
                    if(params.gettoken){
                        res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        user.cart = [];
                        user.save().then().catch();
                        Bill.find({user: user.name}, (err, usuarioFacturas)=>{
                            if(err){
                                res.status(404).send({message: "Error al intentar listar facturas de usuario"});
                            }else{
                                return res.status(200).send({user,Compras_del_usuario: usuarioFacturas});
                            }
                        })
                    }
                }else{
                    res.status(404).send({message: 'El user no ha podido loguearse'});
                }
            });
            }else{
                res.status(404).send({message: 'No se ha podido encontrar al user'});
            }
        }
    });   
}

//=*************************************************************LISTAR =*************************************************************

function listUser(req, res){
    var params = req.body;
    var user = params.user

    User.find({user}, function(err,usuarios){
        if(err){
            res.status(404).send({message: 'Error'});
        }
        return res.status(200).send({user,message:'Listado de usuarios', usuarios});
    });
}

//=*************************************************************MODIFICAR*************************************************************

function updateUser(req, res){
    var userID = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userID, update,{new: true}, (err, userUpdate) =>{
        if(err){
            res.status(500).send({message: 'Error al actualizar al usuario'});
        }else{
            if(!userUpdate){
                res.status(404).send({message: 'No se ha podido actualizar al usuario'});
            }else{
                res.status(200).send({user: userUpdate});
            }
        }
    });
}

//=*************************************************************ELIMINAR=*************************************************************

function deleteUser(req,res){
    var userID = req.params.id;

    User.findByIdAndDelete(userID, (err, userDelete) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar al usuario'});
        }else{
            if(!userDelete){
                res.status(404).send({message: 'No se ha podido eliminar al usuario'});
            }else{
                res.status(200).send({message: 'Usuario eliminado correctamente'});
            }
        }
    });
}

//=*************************************************************CARRITO DE COMPRA*************************************************************

function addCartProduct(req, res){
    var params = req.body;
    var cantidad = params.cantidad;

    if(params.product){
        User.findById(req.user.sub, (err, usuarioEncontrado) =>{
            if(err){
                res.status(404).send({message: 'Error al encontrar usuario'});
            }else{
                if(usuarioEncontrado){
                 Product.findById(params.product,(err,productosEncontrados) =>{
                    if(err){
                        res.status(404).send({message: 'Error al encontrar producto'});
                    }else{
                        if(productosEncontrados){
                            if(cantidad){
                                usuarioEncontrado.cart.push({Producto: productosEncontrados})
                                Product.update({_id: params.product},{ $inc: { stock: -cantidad, vendido: cantidad }}, (err, yesC)=>{
                                    if(err){
                                        res.status(500).send({messages: "Error al momento de descontar los productos"});
                                    }else{
                                        if(yesC.stock == 1){
                                            res.status(404).send({message: "Producto agotado"})
                                        }else{
                                            if(yesC){
                                                usuarioEncontrado.save();
                                                res.status(200).send({message: usuarioEncontrado})
                                            }
                                        }
                                    }
                                });
                            }else{
                                usuarioEncontrado.cart.push({Producto: productosEncontrados})
                                Product.update({_id: params.product},{ $inc: { stock: -1, vendido: 1 }}, (err, yes)=>{
                                    if(err){
                                        res.status(500).send({messages: "Error al momento de descontar los productos"});
                                    }else{
                                        if(yes.stock == 1){
                                            res.status(404).send({message: "Producto agotado"})
                                        }else{
                                            if(yes){
                                                usuarioEncontrado.save();
                                                res.status(200).send({message: usuarioEncontrado})
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
                }
            }
        })
    }else{
        res.status(404).send({message: 'Error, debe introducir todos los campos'});
    }
}



module.exports = {
    pruebaUser,
    guardarUser,
    loginUser,
    deleteUser,
    updateUser,
    addCartProduct,
    listUser
}