"use strict";

import * as Database from './Database.js';
import bcrypt from 'bcrypt';
import Error from './Error.js';


const db = Database.connect();
const table = 'client';

class ClientsController {

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
    
    static cliAuth(req, res) {
        // db.select()
        //     .table(table)
        //     .where('id', req.params.id)
        //     .then((result) => {
        //         // if no ressource catch
        //         if (result <= 0) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));
        //         res.json(result[0]);
        //     })
        //     .catch((error) => console.error(error));
        res.json(req.get("authorization"));
        }


    static create(req, res) {
        ClientsController.encryptPassword(req.body.password)
            .then((hashedPassword) => {
                const newClient = {
                    nom_client: req.body.name,
                    mail_client: req.body.mail,
                    passwd: hashedPassword,
                    cumul_achats: 0
                };
                db.insert(newClient)
                    .table(table)
                    .then((result) => {
                        res.json(newClient);
                    })
                    .catch((error) => res.status(500).json(Error.create(500, error)));
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
        
    }

    static encryptPassword(password) {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });
    }

}

export default ClientsController;
