'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {
        return 'movie';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).example('Le Film Epic').description('Title of the movie'),
            description: Joi.string().min(1).example('Le filme très epic où les gentils gagnent').description('Description of the user'),
            releaseDate: Joi.date().default(new Date()).description('Release date of the movie'),
            director: Joi.string().min(1).example('Hattie Larkin').description('Name of the director'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

};