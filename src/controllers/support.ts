import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import { dto, httpResponse, sendGrid, constants } from '../helpers';
import config from '../config';
/**
 * @description contactUs is a controller used to to send a message for the email support
 * when someone uses the contact us form
 * @param {Request} request represents request object
 * @param {Response} response represents response object
 * @param {NextFunction} _next middleware function
 * @param {Transaction} transaction represent database transaction
 * @return {Promise<Response>} object contains success status
 */

export const contactUs = async (
  request: Request,
  response: Response,
  _next: NextFunction,
  transaction: Transaction,
): Promise<Response> => {
  const { email, name, type, body } = dto.generalDTO.bodyData(request);
  const { emailTemplates } = constants;
  const adminMessage = {
    to: config.emailsConfig.sendGridFrom,
    from: config.emailsConfig.sendGridTo,
    subject: `Contact Us Ticket Type :${type}`,
    text: `
       From name: ${name}
       email: ${email}
       body: ${body}`,
  };

  const [emailStatus] = await sendGrid.send(adminMessage);
  const userMessage = {
    to: email,
    from: emailTemplates.contactForm.from,
    subject: emailTemplates.contactForm.subject,
    templateId: emailTemplates.contactForm.templateId,
    dynamicTemplateData: {
      email,
    },
  };
  await sendGrid.send(userMessage);
  await transaction.commit();
  return httpResponse.ok(response, { status: emailStatus.statusCode }, '');
};
