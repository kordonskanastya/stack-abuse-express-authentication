const { Pool } = require('pg');
const { postgres: config } = require('./config');
const { decryptToken } = require('./utils');

const client = new Pool(config);

async function createUser ({
  firstName,
  lastName,
  email,
  password
}) {
  try {
    const emailUser = await client.query(
      'Select email from users where email=$1 ', [email]);
    if(emailUser.rows.length!==0){
      throw new Error(`ERROR:Email ${email} is defined,
        please try another email`);
    } else {
      const res = await client.query(
        `INSERT INTO users(id, firstName, lastName, email, password)
       VALUES (DEFAULT, $1, $2, $3, $4)
       RETURNING *`,
        [firstName, lastName, email, password],
      );
      return res.rows[0];
    }
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};

async function getUserByEmail (email) {
  try {
   const res = await client.query(
      'SELECT * From users WHERE email like $1',
      [`%${ email }%`],
    );
    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};

async function createAdvertisement ({
  title,
  text,
  token
}) {
  try {
    const {email} = decryptToken(token);
    const {id} = await getUserByEmail(email);
    const res = await client.query(
      `INSERT INTO advertisements(id, title, text, fk_user_id)
      VALUES (DEFAULT, $1, $2, $3)
      RETURNING *`,
      [title, text, id],
    );
    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};

async function getAllAdvertisements (token) {
  try {
    const {email} = decryptToken(token);
    const {id} = await getUserByEmail(email);
    const res = await client.query(
      'SELECT * FROM advertisements WHERE fk_user_id = $1',
      [id]);
    return res.rows;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};

async function completeAdvertisement (id) {
  try {
    const boolTrue = 'true';
    const res = await client.query(
      `UPDATE advertisements SET completed=$1
      WHERE id = $2`,
      [boolTrue, id]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  createAdvertisement,
  getAllAdvertisements,
  completeAdvertisement,
};
