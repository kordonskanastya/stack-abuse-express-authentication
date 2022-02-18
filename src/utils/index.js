const { createHmac } = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const getHashedPassword = (password) => {
    const hash = createHmac('sha256', config.passwordSecret)
    .update(password)
    .digest('hex');
    return hash;
};

function generateAccessToken(email) {
    return jwt
      .sign({email},
        config.accessTokenSecret, {expiresIn: '12h'});
};

function generateRefreshToken(email) {
  return jwt.sign({email}, config.refreshTokenSecret);
};

function decryptToken(token) {
  return jwt.decode(token);
};

module.exports = {
    getHashedPassword,
    generateAccessToken,
    generateRefreshToken,
    decryptToken
};
