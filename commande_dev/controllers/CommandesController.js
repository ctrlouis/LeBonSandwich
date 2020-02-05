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
                let collec = {type: "collection", count: result.length, commandes: []};
                result.forEach(commande => {
                    collec.commandes.push({
                        id: commande.id,
                        mail_client: commande.mail,
                        date_commande: new Date(commande.created_at).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year:'numeric'}),
                        montant: commande.montant})
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
            .then((result) => {
                // if no ressource catch
                if (result <= 0) res.status(404).json(Error.create(404, "Ressource not available: " + req.originalUrl));
                let collec = {type: "ressource", commande: []};
                result.forEach(cmd => {
                    collec.commande.push({id: cmd.id, mail_client: cmd.mail, nom_client: cmd.nom, date_commande: cmd.created_at, date_livraison: cmd.livraison, montant: cmd.montant})
                });
                res.json(collec);
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
                    .catch((error) => res.status(500).json(Error.create(500, error)));
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
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
                    .then((result) =>{
                        res.status(201).location('/commandes/' + req.params.id).json(result);
                    })
            }).catch((error) => res.status(500).json(Error.create(500, error)));
    }

}

export default CommandesController;
