import crypto from 'crypto';
import transport from './transport';
import { logger, level } from '../config/logger';

const algorithm = 'aes-128-cbc';
const key = 'apppasswordkey';
const inputEncoding = 'utf8';
const outputEncoding = 'hex';

export const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).send(data);
};

export const sendJSONResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

export const redirectRequest = (res, url) => {
  res.redirect(url);
};

export const createSuccessResponseJSON = (code, data) => {
  const response = {
    code: code,
    data: data
  };
  return response;
};

export const createErrorResponseJSON = (code, error) => {
  const errorResponse = {
    code: code,
    error: error
  };
  return errorResponse;
};

export const encrypt = data => {
  const mykey = crypto.createCipher(algorithm, key);
  let mystr = mykey.update(data, inputEncoding, outputEncoding);
  mystr += mykey.final('hex');
  return mystr;
};

export const decrypt = data => {
  const mykey = crypto.createDecipher(algorithm, key);
  let mystr = mykey.update(data, outputEncoding, inputEncoding);
  mystr += mykey.final('utf8');
  return mystr;
};

export const sendEmail = async (to, from, subject, text, html, attachments) => {
  logger.log(
    level.debug,
    `utility sendEmail to=${to}, from=${from},subject=${subject},
     text=${text},
     html=${html}`
  );
  try {
    var mailOptions = {
      from,
      to,
      subject,
      text,
      html,
      attachments
    };
    await transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.log(level.error, `utility sendEmail ${error}`);
      }
      logger.log(level.debug, `Email sent:  ${info.response}`);
    });
  } catch (error) {
    logger.log(
      level.error,
      `utility sendEmail to=${to}, from=${from},subject=${subject},
      error=${error}`
    );
  }
};
