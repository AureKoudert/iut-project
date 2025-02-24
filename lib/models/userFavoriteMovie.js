'use strict';

const { Model } = require('objection');

module.exports = class UserFavoriteMovie extends Model {
    static get tableName() {
        return 'user_favorite_movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            userId: Joi.number().integer().required().description('ID of the user'),
            movieId: Joi.number().integer().required().description('ID of the movie'),
            createdAt: Joi.date(),
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = this.updatedAt;
    }
}

