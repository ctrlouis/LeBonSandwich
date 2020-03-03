"use strict";


import express from 'express';
import ClientsController from './../controllers/ClientsController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET commandes listing. */
router.get('/',     ClientsController.all);

/* GET commande by given id. */
router.get('/:id',  ClientsController.id);

/* GET commande by given id. */
router.post('/',    ClientsController.create);

/* Error handler */
router.all('/*',    (req, res) => res.status(405).json(Error.create(405, "Method not allowed")));

export default router;
