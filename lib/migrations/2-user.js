'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.json('role').notNullable(); ;
            table.unique('mail'); 
        });

        await knex('user').update({ role: JSON.stringify(['user']) });
    },

    async down(knex) {
        await knex.schema.alterTable('user', (table) => {
            table.dropColumn('role');
            table.dropUnique('mail'); 
        });
    }
};
