'use strict'

var Category = require('../models/categoria');
var Product = require('../models/producto');

function pruebacategory(req, res){
    res.status(200).send({message: 'Prueba de category funciona correctamente'});
}

//=====================================================================GUARDAR CATEGORIA==========================================================

function saveCategory(req, res){
    var category = new Category();
    var params = req.body;

    if(params.name){
        category.name = params.name;
        Category.findOne({name: category.name.toLowerCase()}, (err, issetCategory) => {
            if(err){
                res.status(500).send({message: 'Error, la categoria ya existe'});    
            }else{
                if(!issetCategory){
                    category.save((err, categorySave) =>{
                        if(err){
                            res.status(500).send({message: 'No se ha guardado la categoria'});
                        }else{
                            if(!categorySave){
                                res.status(500).send({message: 'Error al guardar la categoria'});
                            }else{
                                res.status(200).send({category: categorySave});
                            }
                        }
                    });
                }
            }
        });  
    }else{
        res.status(404).send({message: 'Debe introducir una categoria para agregar'})
    }
}

//=====================================================================ELIMINAR CATEGORIA==========================================================

function deleteCategory(req, res){
    var categoryID = req.params.id;
    var eliminar = req.body;

    Category.findById(categoryID, (err, categoriaDefault) =>{
        if(err){
            res.status(500).send({message: 'Error Error al encontrar categoria'});
        }
        else{
            if(categoriaDefault){
                Product.updateMany({category: categoriaDefault.name}, {$set: {category: "Sin asignar"}}, (err, respuesta) =>{
                    if(respuesta){
                        Category.findByIdAndDelete(categoryID, eliminar, (err, categoryDelete) =>{
                            if(err){ 
                                res.status(500).send({message: 'Error al eliminar la categoria'});
                            }else{
                                if(!categoryDelete){
                                    res.status(404).send({message: 'No se ha podido eliminar la categoria'});
                                }else{
                                    res.status(200).send({message: 'Categoria eliminada correctamente'});
                                }
                            }
                        });
                    }
                });
            }
        }
    })
}

//=========================================================================MODIFICAR CATEGORIAS===============================================

function updateCategory(req, res){
    var categoryID = req.params.id;
    var update = req.body;

    Category.findByIdAndUpdate(categoryID, update,{new: true}, (err, categoryUpdate) =>{
        if(err){
            res.status(500).send({message: 'Error al actualizar la categoria'});
        }else{
            if(!categoryUpdate){
                res.status(404).send({message: 'No se ha podido actualizar la categoria'});
            }else{
                res.status(200).send({category: categoryUpdate});
            }
        }
    });
}

//=========================================================================LISTAR CATEGORIAS===============================================

function listarCategory(req, res){
    var params = req.body;
    var category = params.category

        if(category){
            Product.find({category: category}, function(err,productos){
                if(err){
                    res.status(404).send({message: 'Error'});
                }
                return res.status(200).send({message:'Productos con categoria:',category, productos});
            });
        }else{
            Category.find({}, (err, categorys)=>{
                if(err){
                    res.status(500).send({message: 'No se ha podido listar las categorias'});
                }else{
                    res.status(200).send({message: 'Listado de categorias', categorys});
                }
            })    
        }
}

module.exports = {
    pruebacategory,
    saveCategory,
    deleteCategory,
    updateCategory,
    listarCategory
}