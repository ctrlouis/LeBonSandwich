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
                let collection = {
                    type: "collection",
                    count: result.length,
                    commandes: []
                }

                const filterData = CommandesController.query(req, result);

                filterData.forEach((commande) => {
                    collection.commandes.push( {
                        command: {
                            id: commande.id,
                            nom: commande.nom,
                            create_at: commande.create_at,
                            livraison: commande.livraison.toLocaleDateString('fr-FR', ) + " " + commande.livraison.toLocaleTimeString('fr-FR', ),
                            status: commande.status
                        },
                        links: {
                            self: {
                                href: "/commands/" + commande.id
                            }
                        }
                    });
                });

                res.json(collection);
            })
            .catch((error) => res.status(500).json(Error.create(500, error)));
    }

    static query(req, data) {
        if (req.query.s) {
            data = data.filter( e => e.status == req.query.s);
        }

        return data;
    }

}

export default CommandesController;
