"use strict";

import * as Database from './Database.js';
import Error from './Error.js';
import Pagination from './Pagination.js';
import uuid from 'uuid/v1.js';


const db = Database.connect();
const table = 'commande';

class CommandesController {

    /*
     * Get all
     */
    static all(req, res) {
        let countQuery = db.table(table).count('id as count');

        countQuery = CommandesController.filter(req, countQuery);

        countQuery.then((rowNumber) => {

            const pagination = CommandesController.pagination(req, rowNumber[0].count);

            let query = db.select('*').from(table)
                .limit(pagination.size)
                .offset(pagination.queryOffset);

            query = CommandesController.filter(req, query);

            query.then((result) => {

                    // init collection with meta data
                    let collection = {
                        type: "collection",
                        count: rowNumber[0].count,
                        size: pagination.size,
                        commandes: []
                    }

                    // add pagination metadata
                    collection.links = Pagination.getLinks(pagination, "/commands");

                    // add data into collection
                    result.forEach((commande) => {
                        collection.commandes.push({
                            command: {
                                id: commande.id,
                                nom: commande.nom,
                                create_at: commande.create_at,
                                livraison: commande.livraison.toLocaleDateString('fr-FR', ) + " " + commande.livraison.toLocaleTimeString('fr-FR', ),
                                status: commande.status
                            },
                            links: {
                                self: {
                                    href: "/commandes/" + commande.id
                                }
                            }
                        });
                    });

                    // return collection
                    res.json(collection);
                })
                .catch((error) => res.status(500).json(Error.create(500, error)));
        });
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
                let collec = {
                    type: "ressource",
                    commande: []
                };
                result.forEach(cmd => {
                    collec.commande.push({
                        id: cmd.id,
                        mail_client: cmd.mail,
                        nom_client: cmd.nom,
                        date_commande: cmd.created_at,
                        date_livraison: cmd.livraison,
                        montant: cmd.montant
                    })
                });
                res.json(collec);
            })
            .catch((error) => console.error(error));
    }


    static filter(req, query) {
        // filter by status value
        if (req.query.s) {
            query.where('status', req.query.s);
        }

        return query;
    }

    static pagination(req, rowNumber) {
        let pageSize = Pagination.getPageSize(req); // verify and get page size
        let pagination = Pagination.getPage(req, rowNumber, pageSize); // get row of page
        return pagination;
    }

}

export default CommandesController;
