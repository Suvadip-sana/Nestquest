const User = require("../models/user");


// Render sign up form
module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs");
};

// Signed Up the user into db(save user data in db)
module.exports.signedUp = async (req, res) => {
    try {
      let { username, email, password } = req.body; // Extract email, username, password from req body
      const newUser = new User({ email, username }); // Create new user with the help of username and email
      const registeredUser = await User.register(newUser, password); //save the data into 'user' collection along with password
    //   console.log(registeredUser);
      req.login(registeredUser, (err) => { //Use login method to autometically loged in after sign up
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Nestquest!");
        res.redirect("/listings"); // Use this redirectUrl parameter from the req session object where save the original url, where user try to go befor render the login page
      })
      
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
};


// Render log in form
module.exports.renderLogInForm = (req, res) => {
  res.render("./users/login.ejs");
};


// Check if the user is existing in the server or not
module.exports.logIn = async(req, res) => {
    req.flash("success", "Welcome back to Nestquest!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // check if inside res.locals.redirecturl have any value or not if value exist then save into new variable otherwise goto "/listings" 
    res.redirect(redirectUrl);
};


// Logged out user
module.exports.logOut = (req, res, next) => {
    req.logout((error) => {
        if(error){
            return next(err);
        }
        req.flash("success", "You are Logged out Now!");
        res.redirect("/listings");
    })
};