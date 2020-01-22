"use strict";


import express from 'express';
import ItemsController from './../controllers/ItemsController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET commandes listing. */
router.get('/',     ItemsController.all);

/* GET commande by given id. */
router.get('/:id',  ItemsController.id);

/* Error handler */
router.all('/*',    (req, res) => res.status(405).json(Error.create(405, "Method not allowed")));

export default router;
