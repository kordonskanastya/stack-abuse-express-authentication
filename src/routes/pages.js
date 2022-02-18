const express = require('express');
const {createAdvertisement, getAllAdvertisements} = require('../db');

const pages = express.Router();

pages.get('/protected', async (req, res) => {
    if (req.user) {
      const token = req.cookies.accessToken;
      const allAdds = await getAllAdvertisements(token);
        res.render('protected', {
          title: 'Advertisements list',
          isIndex: true,
          allAdds
        });
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

pages.get('/create', (req, res) => {
  if (req.user) {
      res.render('create');
  } else {
      res.render('login', {
          message: 'Please login to continue',
          messageClass: 'alert-danger'
      });
  }
});

pages.post('/create', async (req, res) => {
  if (req.user) {
    const {title, text} = req.body;
    const token = req.cookies.accessToken;
    const flag = await createAdvertisement({
      title,
      text,
      token
    });
    if (!flag) {
      res.render('create');
    }
    res.render('protected');
  } else {
      res.render('login', {
          message: 'Please login to continue',
          messageClass: 'alert-danger'
      });
  }
});

module.exports = pages;
