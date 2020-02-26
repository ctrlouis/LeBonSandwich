"use strict";

import * as Database from './Database.js';
import Error from './Error.js';


const db = Database.connect();
const table = 'item';

class ItemsController {

    static all(req, res) {
        db.select().table(table)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
    }

    static id(req, res) {
        db.select()
            .table(table)
            .where('id', req.params.id)
            .then((result) => {
                // if no ressource catch
                if (result <= 0) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));
                res.json(result[0]);
            })
            .catch((error) => console.error(error));
    }

    static itemsBelongsTo(req, res){
        db.select()
        .table(table)
        .where('command_id', req.params.id)
        .then((result) => {
            if(result <= 0)
                res.status(404).json(Error.create(404, "Ressources not available " + req.originalUrl));
            else{
                let collec = {type: "collection", commande: req.params.id, items: []};
                result.forEach((item, i) => {
                    collec.items.push({uri: item.uri, libelle: item.libelle, tarif: item.tarif, montant: item.montant, quantite: item.quantite});
                });
                res.json(collec);
            }

        })
        .catch((error) => console.error(error));
    }

}

export default ItemsController;
