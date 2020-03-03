"use strict";

import * as Database from './Database.js';
import Error from './Error.js';
import axios from 'axios';
import uuid from 'uuid/v1.js';
import bcrypt from 'bcrypt';

import Tools from './Tools.js';


const db = Database.connect();
const table = 'commande';
const saltRounds = 10;

class CommandesController {

    /*
     * Get all
     */
    static all(req, res) {
        db.select().table(table)
            .then((result) => {
                if (result <= 0) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));

                let collec = {
                    type: "collection",
                    count: result.length,
                    commandes: []
                };
                result.forEach(commande => {
                    collec.commandes.push({
                        id: commande.id,
                        mail_client: commande.mail,
                        date_commande: Tools.formatDateHour(commande.created_at),
                        montant: commande.montant
                    })
                });
                res.json(collec);
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
            .first()
            .then((result) => {
                // if no ressource catch
                if (!result) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));

                const givenToken = CommandesController.getToken(req);
                if (!CommandesController.checkToken(givenToken, result.token)) {
                    res.status(401).json(Error.create(401, "Wrong access token " + givenToken));
                }

                let collec = {type: "ressource", links: {}, commande: []};
                collec.links.self = '/commandes/' + result.id + '/';
                collec.links.items = '/commandes/' + result.id + '/items';
                collec.commande.push({
                    id: result.id,
                    livraison: Tools.formatDateHour(result.livraison),
                    nom_client: result.nom,
                    mail_client: result.mail,
                    status: result.status,
                    montant: result.montant,
                });
                db.select()
                .table('item')
                .where('command_id', req.params.id)
                .then((result) => {
                    let items = [];
                    result.forEach((item, i) => {
                      items.push({uri: item.uri, libelle: item.libelle, tarif: item.tarif, quantite: item.quantite});
                    });
                    collec.commande[0].items = items;
                    res.status(200).json(collec)
                })
                .catch((error) => Error.create(500, error));
            })
            .catch((error) => console.error(error));
    }

    /*
     * Create
     */
    static create(req, res) {
        const id = uuid(); // generate id
        let validatedData = CommandesController.validatedData(req.body)
        if(!validatedData.valid){
            res.status(500).json(Error.create(500, validatedData.error));
        }
        else
        {
            bcrypt.hash(id, saltRounds, function (err, token) {

                const items = req.body.items;
                const requests = [];
                items.forEach(item => requests.push(CommandesController.getSandwichRequest(item.uri)));

                // get all used sandwichs
                axios.all(requests)
                    .then(axios.spread(function (...sandwichs) {

                        // new commande
                        const insertData = {
                            nom: req.body.nom,
                            mail: req.body.mail,
                            livraison: new Date(req.body.livraison.date + ' ' + req.body.livraison.heure),
                            id: uuid(),
                            token: token,
                            created_at: new Date()
                        };

                        let insertItems = [];
                        sandwichs.forEach((sandwich) => {
                            const quantity = req.body.items.find(e => e.uri == "/sandwichs/" + sandwich.data.ref); // get corresponding quantity
                            insertItems.push({
                                uri: '/sandwichs/' + sandwich.data.ref,
                                libelle: sandwich.data.nom,
                                tarif: sandwich.data.prix.$numberDecimal,
                                quantite: quantity.q,
                                command_id: insertData.id
                            });
                        });

                        let amount = 0;
                        insertItems.forEach(item => amount += item.quantite * item.tarif);
                        insertData.montant = amount;

                        // insert items
                        db.insert(insertItems).table('item')
                            .then((res) => {})
                            .catch((err) => console.log(err));

                        db.insert(insertData).into(table)
                            .then((result) => {

                                db.select()
                                    .table(table)
                                    .where('id', insertData.id)
                                    .first()
                                    .then((result) => {
                                        if (!result) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));

                                        const newCommandeFormated = {
                                            commande: {
                                                nom: insertData.nom,
                                                mail: insertData.mail,
                                                livraison: {
                                                    date: Tools.formatDate(insertData.livraison),
                                                    heure: Tools.formatHour(insertData.livraison)
                                                },
                                                id: insertData.id,
                                                token: insertData.token,
                                                montant: insertData.montant,
                                                items: items
                                            }
                                        };

                                        res.status(201).location('/commandes/' + insertData.id).json(newCommandeFormated);
                                    })
                                    .catch((error) => res.status(500).json(Error.create(500, error)));
                                    // end of selection to return value
                            })
                            .catch((error) => res.status(500).json(Error.create(500, error)));
                            // end of insertion
                    }))
                    .catch((err) => res.status(400).json(err));
                    // end of multiple get sandwich
            });
        }
    }

    /*
     * Update by id
     */
    static update(req, res) {

        db(table)
            .where('id', req.params.id)
            .update({
                "updated_at": new Date(),
                "livraison": new Date(req.body.livraison),
                "nom": req.body.nom,
                "mail": req.body.mail,
                "montant": req.body.montant,
                "remise": req.body.remise,
                "token": req.body.token,
                "cliend_id": req.body.cliend_id,
                "ref_paiement": req.body.ref_paiement,
                "date_paiement": req.body.date_paiement == null ? null : new Date(req.body.date_paiement),
                "mode_paiement": req.body.mode_paiement,
                "status": req.body.status
            })
            .then((result) => {
                if (result <= 0) res.status(404).json(Error.create(404, "Ressource not updated: " + req.originalUrl));
                db.select()
                    .table(table)
                    .where('id', req.params.id)
                    .then((result) => {
                        res.status(201).location('/commandes/' + req.params.id).json(result);
                    })
            }).catch((error) => res.status(500).json(Error.create(500, error)));
    }

    // check if token is true
    static checkToken(givenToken, correctTokken) {
        return givenToken == correctTokken;
    }

    // get token send in request
    static getToken(req) {
        if (req.query.token) {
            return req.query.token;
        }

        if (req.headers.token) {
            return req.headers.token;
        }

        return null;
    }

    // generate sandwich uri
    static getSandwichRequest(uri) {
        const url = "http://api.catalogue:8080" + uri;
        return axios.get(url);
    }

    // confirm dataset format respecting table's format
    static validatedData(dataset){
        let res = {valid: true, error: 'Bad format'};
        //Mail check
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(dataset.mail)){
            res.valid = false;
            res.error = 'Bad mail format';
        }
        //Name check (ex: Victor Bour = 1, VictR Bour = 0)
        if(!/^[A-Z]?[a-z]{2,}\s[a-zA-Z]{2,}$/.test(dataset.nom)){
            res.valid = false;
            res.error = 'Bad firstname and lastname format'
        }
        //check date format
        if(dataset.livraison){
            let date = new Date(dataset.livraison.date + ' ' + dataset.livraison.heure);
            date.setHours(date.getHours() - 1); //Evite l'ajout inutile d'une heure (GMT), qui brise la comparaison
            if(Date.parse(date) < Date.now() || date == 'Invalid Date'){
                res.valid = false;
                res.error = 'Date de livraison invalide';
            }
        }
        else{
            res.valid = false;
            res.error = 'Date de livraison invalide';
        }
        //Check items listes
        if(dataset.items){
            dataset.items.forEach((item, i) => {
                if(!/^[1-9]+$/.test(item.q)){
                    res.valid = false;
                    res.error = item.uri + ' n\'a pas une quantité valide';
                }
                else if(!/^(\/sandwichs\/).*/.test(item.uri)){
                    res.valid = false;
                    res.error = item.uri + ' n\'est pas un lien valide';
                }
            });
        }
        else{
            res.valid = false;
            res.error = 'Liste d\'items invalide';
        }

        return res;
    }

}

export default CommandesController;
