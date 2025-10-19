import sendEmail from "../config/emailConfiguration"
import ejs from 'ejs';
import path from 'path';
import logger from "../config/logger";

const __dirname = import.meta.dirname;

const sendOtp = async (recipient, subject, username, otp) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'verifyOtp.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, otp: otp});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Otp sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending Otp: ${error}`)
    };
};

const sendWelcomeEmail = async (recipient, subject, username) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'welcomeMessage.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Welcome email sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending welcome message: ${error}`)
    };
};

const sendPasswordRecoveryEmail = async (recipient, subject, username, link) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'verifyOtp.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, resetLink: link});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Password reset link sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending password reset link: ${error}`)
    };
};

const sendRecommededJobsEmail = async (recipient, subject, username, jobs) => {
    try {
        const templatePath = path.join(__dirname, '../..', 'views', 'verifyOtp.ejs');
        console.log(templatePath);
        
        const htmlData = await ejs.renderFile(templatePath, {user: username, recommendedJobs: jobs});
        await sendEmail(recipient, subject, htmlData);

        logger.info(`Job recommedations sent to ${username} successfully.`);
    } catch (error) {
        logger.error(`Error sending job recommendations: ${error}`)
    };
};


export {sendOtp, sendWelcomeEmail, sendRecommededJobsEmail, sendPasswordRecoveryEmail}
