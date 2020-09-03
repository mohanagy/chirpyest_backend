import sgMail from '@sendgrid/mail';
import config from '../config';

sgMail.setApiKey(config.emailsConfig.sendGridKey);

export default sgMail;
