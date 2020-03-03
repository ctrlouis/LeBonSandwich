"use strict";

import * as Database from './Database.js';


const db = Database.connect();
const table = 'item';

class ItemsController {

    /*
     * Get by id
     */
    static command(id) {
        return new Promise((resolve, reject) => {
            db.select()
                .table(table)
                .where('command_id', id)
                .then((result) => {
                    resolve(result);
                });
        });
    }

    static format(items) {
        let formatItems = [];
        items.forEach((item) => {
            formatItems.push({
                uri: item.uri,
                libelle: item.libelle,
                tarif: item.tarif,
                quantite: item.quantite
            });
        });
        return formatItems;
    }

}

export default ItemsController;