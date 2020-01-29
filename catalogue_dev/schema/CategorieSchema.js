"use strict";

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const collection = 'categories';

export const CategorieSchema = new Schema({
        id: {type:Number},
        nom: {type: String, required: true},
        description: {type:String, default: ''}
}, {
    versionKey: false
});

export const CategorieModel = mongoose.model(collection, CategorieSchema);
