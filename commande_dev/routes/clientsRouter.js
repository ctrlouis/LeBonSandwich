"use strict";


import express from 'express';
import ClientsController from './../controllers/ClientsController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET commandes listing. */
// router.get('/',             ClientsController.all);

/* GET commande by given id. */
router.get('/:id',          ClientsController.id);

/* GET commande by given id. */
router.post('/',            ClientsController.create);

/* POST client authentification */
router.post('/:id/auth',    ClientsController.login);

/* Error handler */
router.all('/*', (req, res) => Error.send(res, 405));

export default router;
