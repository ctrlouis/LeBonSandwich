"use strict";

import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const collection = 'sandwichs';

export const SandwichSchema = new Schema({
    ref: String,
    nom: String,
    description: String,
    type_pain: String,
    image: {
        ref: String,
        titre: String,
        type: String,
        def_x: Number,
        def_y: Number,
        taille: Number,
        filename: String
    },
    categories: [String],
    prix: {
        $numberDecimal: String
    }
});

export const SandwichModel = mongoose.model(collection, SandwichSchema);
