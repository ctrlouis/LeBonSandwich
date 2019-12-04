"use strict";


import express from 'express';
import bodyParser from 'body-parser';

import * as Commandes from './src/modeles/commandes.js';


const app = express();

app.use(bodyParser( { extended : false }));

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/commandes', function(req, res) {
    res.json(Commandes.all());
});

app.get('/commandes/:id', function(req, res) {
    res.json(Commandes.id(req.params.id));
});

app.post('/commandes', function(req, res) {
    res.send(req.body);
});


app.listen(3000);
