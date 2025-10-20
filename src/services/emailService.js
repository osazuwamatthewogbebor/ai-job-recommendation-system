import sendEmail from "../config/emailConfiguration.js"
import ejs from 'ejs';
import path from 'path';
import logger from "../config/logger.js";

const __dirname = import.meta.dirname;

const sendOtp = async (recipient, subject='Verify Your Account', username, otp, otpTime) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'verifyOtp.ejs');
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, otp: otp, otpTime: otpTime});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Otp sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending Otp: ${error}`)
    };
};

const sendWelcomeEmail = async (recipient, subject='Welcome to Smart AI Jobber!', username) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'welcomeMessage.ejs');
        
        const htmlData = await ejs.renderFile(templatePath, {user: username});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Welcome email sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending welcome message: ${error}`)
    };
};

const sendPasswordRecoveryEmail = async (recipient, subject='Password Reset Request', username, link) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'passwordRecovery.ejs');
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, resetLink: link});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Password reset link sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending password reset link: ${error}`)
    };
};

const sendRecommededJobsEmail = async (recipient, subject='Your Job Recommendations', username, jobs) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'recommendedJobs.ejs');
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, recommendedJobs: jobs});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Job recommedations sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending job recommendations: ${error}`)
    };
};


export default {
    sendOtp,
    sendWelcomeEmail,
    sendRecommededJobsEmail,
    sendPasswordRecoveryEmail,
};