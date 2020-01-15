"use strict";

import * as Database from './Database.js';
import Error from './Error.js';
// import uuid from 'uuid/v1';


const db = Database.connect();
const table = 'commande';

class CommandesController {

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

    static create(req, res) {
        // res.send(uuid());
        res.send("test");
    }

}

export default CommandesController;
