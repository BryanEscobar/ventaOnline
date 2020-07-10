'use strict'

var Product = require('../models/producto');
var Category = require('../models/categoria');

function pruebaproducto(req,res){
    res.status(200).send({message: 'Prueba del controlador de productos funciona correctamente'})
}


//=====================================================================GUARDAR PRODUCT==========================================================

function saveProduct(req, res){
    var product = new Product();
    var params = req.body;

    if(params.name && params.category){
        product.name = params.name;
        product.category = params.category;
        product.stock = params.stock;

            Product.findOne({name: product.name.toLowerCase()}, (err, issetProduct) => {
                if(!issetProduct){
                    Category.findOne({name: product.category}, (err, issetCategory)=>{
                        if(err){
                            res.status(500).send({message: 'Error desconocido, verifique los datos de la categoria'});
                        }else{
                            if(!issetCategory){
                                res.status(500).send({message: 'Categoria inexistente, verifique la sintaxis del campo'});
                            }else{
                                product.save((err, productSave) =>{
                                    if(err){
                                        res.status(500).send({message: 'No se ha guardado el producto'});
                                    }else{
                                        if(!productSave){
                                            res.status(500).send({message: 'Error al guardar el producto'});
                                        }else{
                                            res.status(200).send({product: productSave});
                                        }
                                    }
                                });
                            }
                        }
                    });
                }else{
                    return res.status(500).send({message: "Error, producto ya existente, verifique el stock de los productos."});
                }
            });  
    }else{
        res.status(404).send({message: 'Debe introducir todos los parametros'})
    }
}

//=====================================================================ELIMINAR PRODUCT==========================================================

function deleteProduct(req, res){
    var productID = req.params.id;
    var eliminar = req.body;

    Product.findByIdAndDelete(productID, eliminar, (err, productDelete) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el producto'});
        }else{
            if(!productDelete){
                res.status(404).send({message: 'No se ha podido eliminar el producto'});
            }else{
                res.status(200).send({message: 'Producto eliminado correctamente'});
            }
        }
    });
}

//====================================================================ACTUALIZAR PRODUCT==========================================================
function updateProduct(req, res){
    var productID = req.params.id;
    var update = req.body;

    Product.findByIdAndUpdate(productID, update,{new: true}, (err, productUpdate) =>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el producto'});
        }else{
            if(!productUpdate){
                res.status(404).send({message: 'No se ha podido actualizar el producto'});
            }else{
                res.status(200).send({product: productUpdate});
            }
        }
    });
}

//=========================================================================LISTAR PRODUCT===============================================

function listProduct(req, res){
    var params = req.body;
    var product = params.name

    if(product){
        Product.find({name: product}, function(err,productos){
            if(err){
                res.status(404).send({message: 'Error'});
            }
            return res.status(200).send({Producto_Encontrado: productos});
        });
    }else{
        Product.find({}, (err, products)=>{
            if(err){
                console.log(err);
                res.status(500).send({message: 'No se ha podido listar los productos'});
            }else{
                res.status(200).send({message: 'Listado de productos', products});
            }
        })
    }
}




//=========================================================================LISTAR PRODUCT===============================================

async function masVendido(req, res){
    const vendido = await Product.find().select('name vendido').sort({'vendido': -1}).limit(3);
    
    res.status(200).send({vendido});
}

module.exports = {
    pruebaproducto,
    saveProduct,
    deleteProduct,
    updateProduct,
    masVendido,
    listProduct
}