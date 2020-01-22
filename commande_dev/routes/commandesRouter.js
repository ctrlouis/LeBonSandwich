"use strict";


import express from 'express';
import CommandesController from './../controllers/CommandesController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET commandes listing. */
router.get('/',     CommandesController.all);

/* GET commande by given id. */
router.get('/:id',  CommandesController.id);

/* POST Create commande */
router.post('/',    CommandesController.create);

/* PUT Update commande */
router.put('/:id',  CommandesController.update);

/* Error handler */
router.all('/*',    (req, res) => res.status(405).json(Error.create(405, "Method not allowed")));

export default router;
