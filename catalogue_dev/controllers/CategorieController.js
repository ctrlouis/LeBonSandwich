"use strict";

import Error from './Error.js';
import uuid from 'uuid/v1.js';
import {CategorieSchema, CategorieModel} from '../schema/CategorieSchema.js';
import ConnectionFactory from './ConnectionFactory.js';

class CategorieController {

    /*
     * Get all
     */
    static all(req, res) {
        ConnectionFactory.connect();
        CategorieModel.find({}, function(err, categories) {
            if (err) return handleError(err);
            res.json(lots);
        });
    }

    /*
     * Get by id
     */
    static id(req, res) {
        ConnectionFactory.connect();
        CategorieModel.find({id: Number(req.params.id)}, function(err, categories){
            if (err) return handleError(err);
            res.json(categories);
        });
    }
}

export default CategorieController;
