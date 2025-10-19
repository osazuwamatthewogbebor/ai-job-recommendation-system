import nodemailer from 'nodemailer';
import APP_CONFIG from './APP_CONFIG';
import logger from './logger';


const transporter = nodemailer.createTransport({
    host: APP_CONFIG.EMAIL_SERVICE_HOST,
    port: APP_CONFIG.EMAIL_SERVICE_PORT,
    secure: true,
    auth: {
        user: APP_CONFIG.EMAIL_SERVICE_USER,
        pass: APP_CONFIG.EMAIL_SERVICE_APP_PASSWORD,
    },
});



const sendEmail = async (recipient, subject, data) => {

    const mailOptions = {
            from: APP_CONFIG.EMAIL_SERVICE_USER,
            to: recipient,
            subject: subject,
            html: data,
        };

    try {
        await transporter.verify();
        logger.info("Email server is ready to take our messages.");

        const info = await transporter.sendMail(mailOptions);

        logger.info(`Message sent successfully: ${info.messageId}`);

    } catch (err) {
        logger.error(`Email sending failed: ${err}`);
    };

};

export default sendEmail;