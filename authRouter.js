const express = require('express');
const router = express.Router();
const controller = require('./authController.js')

const urlencodedParser = express.urlencoded({extended: false});

router.post('/logup', urlencodedParser, controller.logup)

router.post('/login', urlencodedParser, controller.login)

router.get('/logout', controller.logout)

router.get('/users', controller.users)

module.exports = router;