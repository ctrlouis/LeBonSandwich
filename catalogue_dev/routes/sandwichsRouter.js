"use strict";


import express from 'express';
import SandwichsController from './../controllers/SandwichsController.js';
import Error from './../controllers/Error.js';


const router = express.Router();

/* GET sandwichs by given id. */
router.get('/',  SandwichsController.all);

/* GET sandwichs by given id. */
router.get('/:id',  SandwichsController.id);

/* Error handler */
router.all('/*', (req, res) => Error.send(405));

export default router;
