"use strict";


import express from 'express';
import SandwichsController from './../controllers/SandwichsController.js';
import Error from './../controllers/Error.js';


const router = express.Router();

/* GET categorie by given id. */
router.get('/:id',  SandwichsController.id);

/* Error handler */
router.all('/*',    (req, res) => res.status(405).json(Error.create(405, "Method not allowed")));

export default router;