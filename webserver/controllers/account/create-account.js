'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const sendgridMail = require('@sendgrid/mail');
const uuidV4 = require('uuid/v4');
const AccountModel = require('../../../databases/models/account-model');
const UserModel = require('../../../databases/models/user-model');
const PuaModel = require('../../../databases/models/pua-model');

const verificationCode = uuidV4();

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function insertUserAccount(email, password) {
  const securePassword = await bcrypt.hash(password, 10);
  const uuid = uuidV4();
  const now = new Date();
  const createdAt = now.toISOString().substring(0, 19).replace('T', ' ');

  const data = {
    uuid,
    createdAt,
    confirmedAt: null,
    verificationCode,
    password: securePassword,
    email,

  };
  try {
    await AccountModel.create(data);
    return uuid;
  } catch (error) {
    if (err.ValidationError) {
      throw err;
    } else {
      console.error(error);
    }
  }
}

async function insertPua(uuid) {
  const data = {
    uuid,

  };
  try {
    await PuaModel.create(data);
  } catch (error) {
    if (err.ValidationError) {
      throw err;
    } else {
      console.error(error);
    }
  }
}

async function validate(payload) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    fullName: Joi.string().min(3).max(64).required(),
  };

  return Joi.validate(payload, schema);
}

async function createUser(uuid, email, password, fullName) {
  const userData = {
    uuid,
    avatarurl: null,
    fullName,
    password,
    email,
    secondaryMail: [],
  };

  try {
    await UserModel.create(userData);
  } catch (e) {
    // TODO: SACAR ERROR
    console.error(e);
  }
}

async function sendEmailRegistration(userEmail) {
  const msg = {
    to: userEmail,
    from: {
      email: 'Verification@socialacces.com',
      name: 'SocialAccess Verification',
    },
    subject: 'Welcome to SocialAccess',
    text: 'Please click into the verification link to confirm your SA account and start enjoinjoing thse service.',
    html: `To confirm the account <a href="${process.env.HTTP_SERVER_DOMAIN}/api/account/activate?verification_code=${verificationCode}">activate it here</a>`,
  };

  const data = await sendgridMail.send(msg);

  return data;
}

async function createAccount(req, res, next) {
  const accountData = { ...req.body };
  console.log('accountdata', accountData);
  // Validate user data or send 400 bad request err

  try {
    await validate(accountData);
  } catch (e) {
    // Create validation error
    return res.status(400).send(e);
  }
  const {
    email,
    password,
    fullName,
  } = accountData;

  try {
    // Create the account and send the OK response
    const uuid = await insertUserAccount(email, password);
    res.status(204).json();
    /**
       * We are going to create a minimum structure in mongodb
       */

    await createUser(uuid, email, password, fullName);

    await insertPua(uuid);

    // Generate verification code and send email

    try {
      return await sendEmailRegistration(email);
    } catch (e) {
      console.error('Sengrid error', e);
    }
  } catch (e) {
    // create error
    return res.status(409).send(e);
  }
}

module.exports = createAccount;
