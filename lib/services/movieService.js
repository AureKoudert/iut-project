'use strict';

const { Service } = require('@hapipal/schmervice');
const MailService = require('./mailService');
const { Model } = require('objection');
const UserFavoriteMovie = require('../models/userFavoriteMovie');


module.exports = class movieService extends Service {

    constructor(...args) {
        super(...args);
        this.mailService = new MailService();
    }

    async create(movieData) {
        const { Movie } = this.server.models();
        return await Movie.query().insertAndFetch({
            ...movieData,
            createdAt: movieData.createdAt || new Date(),
            updatedAt: new Date(),
        });
    }

    async list() {
        const { Movie } = this.server.models();
        return await Movie.query();
    }

    async delete(id) {
        const { Movie } = this.server.models();
        await Movie.query().deleteById(id);
        return ''; // réponse vide
    }

    async getById(id) {
        const { Movie } = this.server.models();
        return await Movie.query().findById(id);
    }

    async update(id, movieData) {
        try {
            const { Movie } = this.server.models();
            console.log("Mise à jour du film ID:", id, "avec:", movieData);
    
            const updatedMovie = await Movie.query()
                .patchAndFetchById(id, { ...movieData, updatedAt: new Date() });

            if (!updatedMovie) {
                throw new Error("Movie not found or update failed");
            }

            return updatedMovie;
        } catch (error) {
            console.error("Erreur update:", error);
            throw new Error("Database update failed");
        }
    }

    async addToFavorites(userId, movieId) {
        try {
            console.log("Checking movie existence:", movieId);
            const { Movie, UserFavoriteMovie } = this.server.models();
            const movie = await Movie.query().findById(movieId);
            
            if (!movie) {
                console.error("Movie not found:", movieId);
                throw new Error('Movie not found');
            }
    
            console.log("Checking if already in favorites:", userId, movieId);
            const favorite = await UserFavoriteMovie.query().findOne({ userId, movieId });
    
            if (favorite) {
                console.error("Movie already in favorites:", movieId);
                throw new Error('Movie already in favorites');
            }
    
            console.log("Inserting into favorites:", userId, movieId);
            return await UserFavoriteMovie.query().insert({ userId, movieId });
        } catch (error) {
            console.error("Error in addToFavorites:", error);
            throw error;
        }
    }

    async removeFromFavorites(userId, movieId) {
        try {
            return await UserFavoriteMovie.query()
                .where({ userId, movieId })
                .delete();
        } catch (error) {
            console.error("Error while removing from favorites:", error);
            throw new Error("Failed to remove movie from favorites");
        }
    }

    async getUserFavorites(userId) {
        try {
            const favorites = await UserFavoriteMovie.query()
                .where({ userId })
                .withGraphJoined('movie')
                .select('movie.*');
    
            console.log("Favorites found:", favorites);
            return favorites;
        } catch (error) {
            console.error("Database error in getUserFavorites:", error);
            throw error;
        }
    }

    async isFavorite(userId, movieId) {
        try {
            const favorite = await UserFavoriteMovie.query()
                .where({ userId, movieId })
                .first();
            return !!favorite;
        } catch (error) {
            console.error("Error while checking if favorite:", error);
            throw new Error("Failed to check if movie is favorite");
        }
    }
}