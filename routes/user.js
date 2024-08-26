const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // Require the user schema
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport"); // Require passport for authentication
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// Render signed up form
router.get("/signup", userController.renderSignUpForm);


// Signd up the user(save user data in db)
router.post("/signup", wrapAsync(userController.signedUp));





// Render log in form
router.get("/login", userController.renderLogInForm);


// check if the user is exist or not after try to logged in(authentication)
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.logIn);



// Log out user
router.get("/logout", userController.logOut);


module.exports = router;
