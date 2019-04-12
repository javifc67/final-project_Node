'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const UserMOdel = require('../../../databases/models/account-model');

async function validateData(payload) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  };

  return Joi.validate(payload, schema);
}

async function login(req, res, next) {
  /**
     * Validar datos de entrada con Joi
     */
  const accountData = { ...req.body };
  try {
    await validateData(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const result = await UserMOdel.find({ email: accountData.email });
    if (result.length === 1) {
      const userData = result[0];
      if (!userData.confirmedAt) {
        return res.status(403).send();
      }
      const laPasswordEstaOk = await bcrypt.compare(accountData.password, userData.password);
      if (laPasswordEstaOk === false) { // !laPasswordEstaOk
        return res.status(401).send();
      }
      const payloadJwt = {
        uuid: userData.uuid,
        role: 'admin', // userData.role si viene de bbdd
      };

      const jwtTokenExpiration = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL, 10);
      const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, { expiresIn: jwtTokenExpiration });
      const response = {
        accessToken: token,
        expiresIn: jwtTokenExpiration,
      };
      return res.status(200).json(response);
    }

    return res.status(404).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = login;
