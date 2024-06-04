const express = require('express')
const router = express.Router();
const cathchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');
const user = require('../models/user');

// Render register form
// Register
router.route('/register')
    .get(users.renderRegister)
    .post(cathchAsync(users.register))

// Render login form
// Login
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login )
    
// Logout
router.get('/logout', users.logout)

module.exports = router;