"use strict";


import express from 'express';
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Connected to LeBonSandwich catalogue api ! (❛ᴗ❛)');
});


export default router;
