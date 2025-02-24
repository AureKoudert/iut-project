'use strict';

const Joi = require('joi')
const Jwt = require('@hapi/jwt');

module.exports = [
    {
        method: 'get',
        path: '/movies',
        options: {
            auth: { scope: ['user', 'admin'] },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.list();
        }
    },
    {
        method: 'post',
        path: '/movie',
        options: {
            auth: { scope: ['admin'] },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(1).example('Movie Title').description('Title of the movie'),
                    description: Joi.string().required().min(1).example('Movie description').description('Description of the movie'),
                    releaseDate: Joi.date().required().example(new Date()).description('Release date of the movie'), 
                    director: Joi.string().required().min(1).example('Movie director').description('Name of the director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const newmovie = await movieService.create(request.payload);
            return h.response(newmovie).code(201);
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            auth: { scope: ['admin'] }, 
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID du film à supprimer')
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const { id } = request.params;
            const movie = await movieService.getById(id);
            if (!movie) {
                return h.response({ message: "movie not found" }).code(404);
            }

            await movieService.delete(id);
            return h.response('').code(204); 
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            auth: { scope: ['admin'] }, 
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID du film à modifier')
                }),
                payload: Joi.object({
                    title: Joi.string().required().min(1).example('John').description('Title of the movie'),
                    description: Joi.string().required().min(1).example('Doe').description('Description of the movie'),
                    releaseDate: Joi.date().required().example(new Date()).description('Release date of the movie'), 
                    director: Joi.string().required().min(1).example('mycoolpassword2016').description('Name of the director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { movieService } = request.services();
                const { id } = request.params;
                const updateData = request.payload;
        
                const movie = await movieService.getById(id);
                if (!movie) {
                    return h.response({ message: "movie not found" }).code(404);
                }
        
                const updatedmovie = await movieService.update(id, updateData);
                return h.response(updatedmovie).code(200);
            } catch (error) {
                console.error("Erreur PATCH /movie/{id} :", error);
                return h.response({ error: "Internal Server Error", details: error.message }).code(500);
            }
        }
    },



    {
        method: 'post',
        path: '/movies/{id}/favorite',
        options: {
            auth: { scope: ['user', 'admin'] },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1).description('ID du film à ajouter aux favoris')
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { movieService } = request.services();
                console.log("Auth credentials:", request.auth.credentials); 
                const userId = request.auth.credentials.id;
                const movieId = request.params.id;
        
                console.log("User ID:", userId);
                console.log("Movie ID:", movieId);
        
                const result = await movieService.addToFavorites(userId, movieId);
                console.log("Add to favorites result:", result);
        
                return result;
            } catch (error) {
                console.error("Error in handler:", error);
                return h.response({ error: "Internal Server Error" }).code(500);
            }
        }
    },
    {
        method: 'delete',
        path: '/movies/{id}/favorite',
        options: {
            auth: { scope: ['user','admin'] },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('ID du film à supprimer des favoris')
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const userId = request.auth.credentials.id;
            const movieId = request.params.id;

            const isFavorite = await movieService.isFavorite(userId, movieId);
            if (!isFavorite) {
                return h.response({ error: "Movie is not in favorites" }).code(400);
            }

            await movieService.removeFromFavorites(userId, movieId);
            return h.response({ message: "Movie removed from favorites" }).code(200);
        }
    },
    {
        method: 'get',
        path: '/movies/favorites',
        options: {
            auth: { scope: ['user','admin'] },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            const userId = request.auth.credentials.id;

            const favorites = await movieService.getUserFavorites(userId);
            return h.response(favorites).code(200);
        }
    }
];