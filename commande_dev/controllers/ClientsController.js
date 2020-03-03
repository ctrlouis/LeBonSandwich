"use strict";

import * as Database from './Database.js';
import bcrypt from 'bcrypt';
import Error from './Error.js';
import jwt from 'jsonwebtoken';


const db = Database.connect();
const table = 'client';

const saltRounds = 10; // number of salt for bcrypt
const privateJwtKey = "thiskeyisprivate"

class ClientsController {

    static all(req, res) {
        db.select().table(table)
            .then((result) => {
                res.json(result);
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
    }

    static id(req, res) {
        const auth = req.get('authorization');
        const token = auth.replace('Bearer ', "");
        
        const verif = ClientsController.verifyToken(token);
        const id = Number(req.params.id);
        if (verif.id != id) {
            res.status(401).json(Error.create(401, "unauthorized"));
        }

        ClientsController.getClient('id', id)
            .then(client => {
                res.status(200).json(client);
            })
            .catch(err => res.status(401).json(Error.create(401, err)));
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

    static login(req, res) {

        const auth = req.get('authorization');
        var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":"); // decrypt base 64 authorization

        const id = req.params.id;
        const username = credentials[0];
        const password = credentials[1];

        ClientsController.getClient('id', id)
            .then((client) => {
                ClientsController.verifyPassword(password, client.passwd)
                    .then((result) => {
                        if(username != client.nom_client) {
                            res.status(500).json(Error.create(500, "no authorization header present"))
                        }
                        // user is authentificated
                        const token = ClientsController.generateToken({id: client.id});
                        const data = { token: token };
                        res.status(200).json(data);
                    })
                    .catch(err => res.status(500).json(Error.create(401, err)))
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
    }

    static getClient(attribut, compareAttr) {
        return new Promise((resolve, reject) => {
            db.select()
                .table(table)
                .where(attribut, compareAttr)
                .first()
                .then((client) => {
                    // if no ressource catch
                    if (!client) reject("Ressource not available: " + req.originalUrl);
                    resolve(client);
                })
                .catch((error) => reject (error));
        });
    }

    static calculAmount(id, amount) {
        return new Promise((resolve, reject) => {
            ClientsController.getClient('id', id)
                .then((client) => {
                    client.cumul_achats += amount;
                    db(table).where('id', id).update(client)
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                })
                .catch((err) => reject(err));
        });
    }

    static encryptPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) reject(err);
                resolve(hash);
            });
        });
    }

    static verifyPassword(password, hashedPass) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashedPass, function(err, result) {
                if (err) reject(err);
                if (!result) reject("no authorization header present"); // if password is false
                resolve(result);
            });
        });
    }

    static generateToken(data) {
        return jwt.sign(data, privateJwtKey);
    }

    static verifyToken(token) {
        return jwt.verify(token, privateJwtKey);
    }

}

export default ClientsController;
