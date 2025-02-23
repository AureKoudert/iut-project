'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            username: Joi.string().min(3).example('xX_Jhonny_Doe_Xx').description('Username of the user'),
            password: Joi.string().min(8).example('mycoolpassword2016').description('Password of the user'),
            mail: Joi.string().min(8).example('John.Doe1@gmail.com').description('Email address of the user'),
            role: Joi.array().items(Joi.string().valid('user', 'admin')).default(['user']),
        });
    }

    static get jsonAttributes() {
        return ['role', 'scope'];
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        this.role = this.role || ['user'];
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

};