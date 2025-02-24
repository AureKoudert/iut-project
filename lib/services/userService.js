'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@aureliennpm/iut-encrypt')
const MailService = require('./mailService');;

module.exports = class UserService extends Service {

    constructor(...args) {
        super(...args);
        this.mailService = new MailService(); 
    }

    async create(user) {
        const { User } = this.server.models();
        const existingUser = await User.query().findOne({ mail: user.mail });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const hashedPassword = Encrypt.sha1(user.password);
        const newUser = await User.query().insertAndFetch({
            ...user,
            password: hashedPassword
        });

        try {
            await this.mailService.sendWelcomeMail(newUser.mail, newUser.username);
            console.log(`SUCCESS - Mail de bienvenue envoyé à ${newUser.mail}`);
        } catch (error) {
            console.error("ERROR - Erreur lors de l'envoi du mail :", error);
        }

        return newUser;
    }

    async list() {
        const { User } = this.server.models();
        return await User.query();
    }

    async delete(id) {
        const { User } = this.server.models();
        await User.query().deleteById(id);
        return ''; // réponse vide
    }

    async comparePasswords(plainTextPassword, hashedPassword) {
        return Encrypt.compareSha1(plainTextPassword, hashedPassword);
    }

    async getById(id) {
        const { User } = this.server.models();
        return await User.query().findById(id);
    }

    async getByEmail(mail) {
        const { User } = this.server.models();
        return await User.query().findOne({ mail });
    }

    async update(id, userData) {
        try {
            const { User } = this.server.models();
            console.log("Mise à jour de l'utilisateur ID:", id, "avec:", userData);
    
            const updatedUser = await User.query()
                .patchAndFetchById(id, { ...userData, updatedAt: new Date() });

            if (!updatedUser) {
                throw new Error("User not found or update failed");
            }

            return updatedUser;
        } catch (error) {
            console.error("Erreur update:", error);
            throw new Error("Database update failed");
        }
    }
}