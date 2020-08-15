import nodemailer from 'nodemailer';
import config from '../config';

const { emailsConfig } = config;
// async..await is not allowed in global scope, must use a wrapper

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: emailsConfig.smtpServer,
  port: emailsConfig.smtpPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailsConfig.smtpUser, // generated ethereal user
    pass: emailsConfig.smtpPassword, // generated ethereal password
  },
});
