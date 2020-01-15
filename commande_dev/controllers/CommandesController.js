"use strict";

import * as Database from './Database.js';
import Error from './Error.js';
import uuid from 'uuid/v1.js';


const db = Database.connect();
const table = 'commande';

class CommandesController {

    /*
     * Get all
     */
    static all(req, res) {
        db.select().table(table)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
    }

    /*
     * Get by id
     */
    static id(req, res) {
        db.select()
            .table(table)
            .where('id', req.params.id)
            .then((result) => {
                // if no ressource catch
                if (result <= 0) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));
                res.json(result);
            })
            .catch((error) => console.error(error));
    }

    /*
     * Create
     */
    static create(req, res) {

        const insertData = {
            id: uuid(),
            nom: req.body.nom,
            mail: req.body.mail,
            livraison: req.body.livraison,
            created_at: new Date(),
            updated_at: new Date()
        };

        db.insert(insertData).into(table)
        .then((result) => {
            // res.redirect(201, '/commandes/' + insertData.id);
            db.select()
                .table(table)
                .where('id', insertData.id)
                .then((result) => {
                    // if no ressource catch
                    if (result <= 0) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));
                    // else
                    res.status(201).location('/commandes/' + insertData.id).json(result);
                })
                .catch((error) => console.error(error));
        })
        .catch((error) => res.status(500).json(Error.create(500, error)));
    }

}

export default CommandesController;
