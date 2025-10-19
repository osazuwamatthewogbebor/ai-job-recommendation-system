import nodemailer from 'nodemailer';
import APP_CONFIG from './APP_CONFIG.js';
import logger from './logger.js';
import AppError from '../utils/AppError.js';


const transporter = nodemailer.createTransport({
    host: APP_CONFIG.EMAIL_SERVICE_SMTP_HOST,
    port: APP_CONFIG.EMAIL_SERVICE_PORT,
    secure: true,
    auth: {
        user: APP_CONFIG.EMAIL_SERVICE_USER,
        pass: APP_CONFIG.EMAIL_SERVICE_APP_PASSWORD,
    },
});


// Verify the transporter
(async () => {
    try {
        await transporter.verify();
        logger.info("Email server is ready to take our messages.");

    } catch (error) {
        logger.error(`Email server verification failed: ${error}`)
        throw new AppError("Email service verification failed", 500);
    };
})();


const sendEmail = async (recipient, subject, data) => {

    const mailOptions = {
            from: `Smart AI Jobber <${APP_CONFIG.EMAIL_SERVICE_USER}>`,
            to: recipient,
            subject: subject,
            html: data,
        };

    try {
        const info = await transporter.sendMail(mailOptions);

        logger.info(`Email sent successfully: ${info.messageId}`);

    } catch (err) {
        logger.error(`Email sending failed: ${err}`);
        throw AppError('Failed to send email', 500);
    };

};

export default sendEmail;