'use strict';

const AccountModel = require('../../../databases/models/account-model');

async function activate(req, res, next) {
  const { verification_code: verificationCode } = req.query;

  if (!verificationCode) {
    return res.status(400).json({
      message: 'invalid verification code',
      target: 'verification_code',
    });
  }

// TODO: no poder activar la cuenta varias veces
  try {
    const now = new Date();
    const verifiedAt = now.toISOString().substring(0, 19).replace('T', ' ');
    // update account to add the verified at date
    const filter = {
      verificationCode,
      confirmedAt: null,
    };

    const op = {
      $set: {
        confirmedAt: verifiedAt,
      },
    };

    await AccountModel.findOneAndUpdate(filter, op);

    return next();
    // res.send('account activated');
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = activate;
