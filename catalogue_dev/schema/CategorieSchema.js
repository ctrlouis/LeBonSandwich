"use strict";

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const collection = 'categories';

export const CategorieSchema = new Schema({
        nom: String,
        description: String
});

export const CategorieModel = mongoose.model(collection, CategorieSchema);
