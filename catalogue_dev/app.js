"use strict";


/**
 * IMPORT generate
 * by express-generator
 */
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

/**
 * IMPORT perso
 */
import bodyParser from 'body-parser';
import { dirname} from 'path';
import { fileURLToPath } from 'url';

import indexRouter      from './routes/indexRouter.js';
import categorieRouter  from './routes/categorieRouter.js';
import sandwichsRouter  from './routes/sandwichsRouter.js';
import Error            from './controllers/Error.js';


const expressPort = 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * EXPRESS SERVER
 * START HERE
 */
const app = express();

/**
 * MIDDLEWARES set
 * by express-generator
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser({ extended: false }));

/**
 * ROUTES
 */
app.use('/', indexRouter);
app.use('/categories', categorieRouter);
app.use('/sandwichs', sandwichsRouter);

/* ERROR handler */
app.all('/*', (req, res) => Error.send(405));

app.listen(expressPort, () => {
    console.log("Server up and running at localhost: " + expressPort);
});
