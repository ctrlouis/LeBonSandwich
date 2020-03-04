"use strict";


import express from 'express';
import CommandesController from './../controllers/CommandesController.js';
import ItemsController from './../controllers/ItemsController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET commandes listing. */
// router.get('/',     CommandesController.all); 

/* GET commande by given id. */
router.get('/:id',  CommandesController.id);

/* GET items from a commande by given id. */
router.get('/:id/items',  ItemsController.itemsBelongsTo);

/* POST Create commande */
router.post('/',    CommandesController.create);

/* PUT Update commande */
router.put('/:id',  CommandesController.update);

/* Error handler */
router.all('/*',    (req, res) => Error.send(405));

export default router;
