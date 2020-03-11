"use strict";

import Error from './Error.js';
import uuid from 'uuid/v1.js';
import {SandwichSchema, SandwichModel} from '../schema/SandwichSchema.js';
import ConnectionFactory from './ConnectionFactory.js';

class SandwichsController {

    /*
     * Get all
     */
    static all(req, res) {
        ConnectionFactory.connect();
        SandwichModel.find({}, function(err, sandwich){
            if (err || !sandwich)
                res.status(404).send(Error.create(404, 'Ressource introuvable.'));
            else{
                // init collection with meta data
                let collection = {
                    type: "collection",
                    count: sandwich.length,
                    sandwichs: sandwich
                }
                res.json(collection);
            }

        });
    }

    /*
     * Get by id
     */
    static id(req, res) {
        const sandwichsId = req.params.id;
        ConnectionFactory.connect();
        SandwichModel.findOne({ref: sandwichsId}, function(err, sandwich){
            if (err || !sandwich)
                res.status(404).send(Error.create(404, 'Ressource introuvable.'));
            else
                res.json(sandwich);

        });
    }
}

export default SandwichsController;
