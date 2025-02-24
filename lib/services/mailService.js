const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true=SSL, false=TLS
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendWelcomeMail(toEmail, username) {
        const mailOptions = {
            from: `"Mon App" <no-reply@projetnodejs.com>`,
            to: toEmail,
            subject: 'Bienvenue.',
            text: `Bonjour ${username} !! \n\nBienvenue. \n\n Content que vous vous soyez inscrits.\n\n ... \n\n Cordialement.`
        };

        try {
            let info = await this.transporter.sendMail(mailOptions);
            console.log("SUCCESS - Email envoyé : ", info.messageId);
        } catch (error) {
            console.error("ERROR - Erreur lors de l'envoi du mail : ", error);
        }
    }
}

module.exports = MailService;
