"use strict";


import knex from 'knex';


export function connect() {

    return knex({
        client: 'mysql',
        connection: {
            host: 'mysql.commande',
            user: 'command_lbs',
            password: 'command_lbs',
            database: 'command_lbs'
        }
    });
    
}
