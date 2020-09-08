'use strict';

const Mustache = require('mustache');
const querystring = require('querystring');
const fs = require('fs');


function forgotPassword(event, callback) {
    let web_url = process.env.WEB_URL;
    let emailTemplate = process.env.EMAIL_TEMPLATE_FILENAME || "./templates/forgetPassword/index.html";


    var template_data = {
        'resetLink': web_url + "/reset-password/?&ConfirmationCode={####}"
    };

    var contents = fs.readFileSync(emailTemplate, 'utf8');
    var output = Mustache.render(contents, template_data);

    event.response['emailSubject'] = process.env.EMAIL_SUBJECT || "Reset your password.";
    event.response['emailMessage'] = output;
    callback(null, event);
};

exports.handler = (event, context, callback) => {
    event.response.emailMessage = null;
    event.response.emailSubject = null;
    switch (event.triggerSource) {
        case "CustomMessage_ForgotPassword":
            forgotPassword(event, callback);
            break;
    };
};
