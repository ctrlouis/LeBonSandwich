"use strict";

import Error from './Error.js';
import uuid from 'uuid/v1.js';
import {CategorieSchema, CategorieModel} from '../schema/CategorieSchema.js';
import {SandwichSchema, SandwichModel} from '../schema/SandwichSchema.js';
import ConnectionFactory from './ConnectionFactory.js';
import Tools from './Tools.js';

class CategorieController {

    /*
     * Get all
     */
    static all(req, res) {
        ConnectionFactory.connect();
        CategorieModel.find({}, function(err, categories) {
            if (err) return handleError(err);
            let collection = {
              type: 'collection',
              date: Tools.formatDate(),
              count: categories.length,
              categories: categories
            }
            res.json(collection);
        });
    }

    /*
     * Get by id
     */
    static id(req, res) {
        let objet = {
            type: "ressource",
            date: Tools.formatDate(),
            categorie: {},
            links: {}
        };
        ConnectionFactory.connect();
        CategorieModel.findOne({id: Number(req.params.id)}, function(err, categorie){
          console.log(categorie)
            if (categorie){
              objet.categorie.id = categorie.id;
              objet.categorie.nom = categorie.nom;
              objet.categorie.description = categorie.description;
              objet.links.sandwichs = {href: "/categories/" + categorie.id + "/sandwichs/"};
              objet.links.self = {href: "/categories/" + categorie.id + "/"};
              res.json(objet);
            }
            else{
              res.status(404).send(Error.create(404, 'Ressource introuvable.'))
            }
        });
    }

    /*
     * Create
     */
    static create(req, res) {
        ConnectionFactory.connect();
        var id;
        CategorieModel.find({}, function(err, categories){
            if(categories.length > 0){
                id = Math.max.apply(Math, categories.map(function(o){return o.id}))
            }
            else{
                id = 0;
            }
        }).then(() => {
            let categorie = new CategorieModel({
              id: id + 1,
              nom: req.body.nom,
              description: req.body.description
            });
            categorie.save((err) =>{
                if(err)
                    res.json(err);
                else
                    res.json(categorie);
            })
        });
    }

    static getSandwichs(req, res){
      const categorieName = req.params.name;
      ConnectionFactory.connect();
      SandwichModel.find({categories: categorieName}, function(err, sandwichs){
          if (err || !sandwichs)
              res.status(404).send(Error.create(404, 'Ressource introuvable.'));
          else{
            let collec = {
              type: 'collection',
              date: Tools.formatDateHour(),
              count: sandwichs.length,
              categorie: categorieName,
              sandwichs: []
            }
            sandwichs.forEach((item, i) => {
              collec.sandwichs.push(item);
            });
            res.json(collec);
          }

      });
    }
}

export default CategorieController;
