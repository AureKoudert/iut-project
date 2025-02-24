'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.createTable('user_favorite_movie', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().references('id').inTable('user').onDelete('CASCADE');
            table.integer('movieId').unsigned().references('id').inTable('movie').onDelete('CASCADE');
            table.timestamp('addedAt').defaultTo(knex.fn.now()).notNull();
            
        });
    
    },

    async down(knex) {
        return knex.schema.dropTableIfExists('user_favorite_movie');
        
    }
};
