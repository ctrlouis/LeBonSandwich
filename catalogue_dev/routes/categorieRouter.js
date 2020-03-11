"use strict";


import express from 'express';
import CategorieController from './../controllers/CategorieController.js';
import Error from './../controllers/Error.js';
const router = express.Router();


/* GET categorie listing. */
router.get('/',     CategorieController.all);

/* GET categorie by given id. */
router.get('/:id',  CategorieController.id);

/* POST create categorie */
router.post('/',    CategorieController.create);

/* Error handler */
router.all('/*', (req, res) => Error.send(405));

export default router;
