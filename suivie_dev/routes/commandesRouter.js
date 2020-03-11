"use strict";


import express from 'express';
import CommandesController from './../controllers/CommandesController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET commandes listing. */
router.get('/',     CommandesController.all);

/* GET commande by given id. */
router.get('/:id',  CommandesController.id);

/* Error handler */
router.all('/*', (req, res) => Error.send(res, 405));

export default router;
