'use strict';

const Joi = require('joi')
const Jwt = require('@hapi/jwt');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    username: Joi.string().required().min(3).example('xX_Jhonny_Doe_Xx').description('Username of the user'), 
                    password: Joi.string().required().min(3).example('mycoolpassword2016').description('Password of the user'),
                    mail: Joi.string().required().min(8).example('John.Doe1@gmail.com').description('Email address of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { mail } = request.payload;

            // Vérifie si l'email est déjà pris
            const existingUser = await userService.getByEmail(mail);
            if (existingUser) {
                return h.response({ message: "Email already in use" }).code(409);
            }

            const newUser = await userService.create(request.payload);
            return h.response(newUser).code(201);
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            auth: { scope: ['user', 'admin'] },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.list();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            auth: { scope: ['admin'] }, 
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID de l\'utilisateur à supprimer')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { id } = request.params;
            const user = await userService.getById(id);
            if (!user) {
                return h.response({ message: "User not found" }).code(404);
            }

            await userService.delete(id);
            return h.response('').code(204); 
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            auth: { scope: ['admin'] }, 
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID de l\'utilisateur à modifier')
                }),
                payload: Joi.object({
                    firstName: Joi.string().optional().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().optional().min(3).example('Doe').description('Lastname of the user'),
                    username: Joi.string().optional().min(3).example('xX_Jhonny_Doe_Xx').description('Username of the user'), 
                    password: Joi.string().optional().min(3).example('mycoolpassword2016').description('Password of the user'),
                    mail: Joi.string().optional().min(8).example('John.Doe1@gmail.com').description('Email address of the user')
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { userService } = request.services();
                const { id } = request.params;
                const updateData = request.payload;
        
                const user = await userService.getById(id);
                if (!user) {
                    return h.response({ message: "User not found" }).code(404);
                }
        
                const updatedUser = await userService.update(id, updateData);
                return h.response(updatedUser).code(200);
            } catch (error) {
                console.error("Erreur PATCH /user/{id} :", error);
                return h.response({ error: "Internal Server Error", details: error.message }).code(500);
            }
        }
    },
    {
        method: 'patch',
        path: '/user/{id}/role', 
        options: {
            auth: { scope: ['user', 'admin'] }, 
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID de l\'utilisateur dont on veut modifier le role')
                }),
                payload: Joi.object({
                    role: Joi.array().items(Joi.string().valid('user', 'admin')).required()
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { id } = request.params;
            const { role } = request.payload;
    
            const updatedUser = await userService.update(id, { role });
            return h.response(updatedUser).code(200);
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            auth: false, 
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mail: Joi.string().required().example('mail@gmail.com').description('Email de l\'utilisateur de test'),
                    password: Joi.string().required().example('password').description('Mot de passe de l\'utilisateur de test')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { mail, password } = request.payload;

            const user = await userService.getByEmail(mail);
            if (!user) {
                return h.response({ message: "User not found" }).code(404);
            }
            
            const isValid = await userService.comparePasswords(password, user.password);
            if (!isValid) {
                return h.response({ message: "Unauthorized" }).code(401);
            }

            const token = Jwt.token.generate(
                {
                    aud: 'urn:audience:iut',
                    iss: 'urn:issuer:iut',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.mail,
                    scope: user.role.join(' ')
                },
                {
                    key: 'random_string', // La clé
                    algorithm: 'HS512'
                },
                {
                    ttlSec: 14400 // 4h
                }
            );
            return h.response({ login: "successful", token }).code(200);
        }
    },
];