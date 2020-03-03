"use strict";

import Error from './Error.js';
import uuid from 'uuid/v1.js';
import {SandwichSchema, SandwichModel} from '../schema/SandwichSchema.js';
import ConnectionFactory from './ConnectionFactory.js';

class SandwichsController {

    /*
     * Get by id
     */
    static id(req, res) {
        const sandwichsId = req.params.id;
        ConnectionFactory.connect();
        SandwichModel.findOne({ref: sandwichsId}, function(err, sandwich){
            if (err || !sandwich) res.status(404).send(Error.create(404, 'Ressource introuvable.'));
            res.json(sandwich);
        });
    }
}

export default SandwichsController;
