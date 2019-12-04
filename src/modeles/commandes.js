"use strict";


import fs from 'fs';


export class Commandes {

    constructor() {

    }

}

export function all() {
    return getDatas();
}

export function id(id) {
    const commandes = getDatas();

    let res = commandes.commandes.find( e => e.id === id);

    if (!res) res = null;

    return res;
}

function getDatas() {
    let collection = fs.readFileSync('./src/datas/commandes.json');
    collection = JSON.parse(collection);
    return collection;
}
