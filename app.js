if(process.env.NODE_ENV != "production"){ // Purpose of use this, it only used in production level, not in development level because environment variable cradential is not shareable in enywhere.
    require("dotenv").config();  // Require the .env file for this project
};

// require("dotenv").config()  // Require the .env file for this project

const express = require("express");
const app = express();
const port = 4343;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js"); // For throwing custom express error
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js"); // Require listing.js for restucturing the paths using Express Router
const reviewRouter = require("./routes/review.js"); // For all reviews path
const userRouter = require("./routes/user.js"); // For all reviews path
const session = require("express-session"); // For session purpose
const MongoStore = require("connect-mongo"); // Require mongo session to store session related data in mongo db database(Always need to require 'session-mongo' at first to use 'connect-mongo')
const flash = require("connect-flash"); // For flash message
const passport = require("passport"); // Require passport for authentication
const LocalStrategy = require("passport-local"); // Require passport local for simple username password based authentication
const User = require("./models/user.js"); // Require the user schema
const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./models/listing");



app.listen(port, () => {
    console.log("App listening on port ", port);
});


// const mongoDbURL = "mongodb://127.0.0.1:27017/wanderlust";
const mongoDbURL = process.env.ATLASDB_URL; // Get the mongo atlas url from .env file


async function main() {
    // await mongoose.connect(mongoDbURL);
    await mongoose.connect(mongoDbURL);
};

// Call main function
main()
    .then(() => {
        console.log("Connection Successful!");
    })
    .catch((error) => {
        console.log("Error occured on Dtabase connection!", error);
    });


app.set("views", path.join(__dirname, "views")); // Serve the ejs file from the views folder
app.set("view engine", "ejs"); // Set view engine to 'ejs'

app.use(express.static(path.join(__dirname, "/public"))); // Serve the static file from public folder
app.use(methodOverride("_method")); // Use method override
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate); // Set engine to ejs-mate


// Session options for 'connect-mongo'
const store = MongoStore.create({
    mongoUrl: mongoDbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Set interval of update the sesion for every 24 hours in second(3600)
});

// In case error is occure in connect-mongo, Print for debugging
store.on("error", () => {
    console.log("ERROR on mongo session store!", err);
});


// Initialize session options
const sessionOptions = {
    store, //Pass the store variable into express-session
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expiry date of the session that is 7 days from it's creation time( That's why there is added 7 days, 1 day have 24h, 1h have 60 min, 1min have 60s, 1 second have 1000 milisecond)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};


app.use(session(sessionOptions)); // Session middleware with the session options
app.use(flash()); //Flash Middleware


// For authentication part using Passport library
passport.initialize();
app.use(passport.session()); // In web site one user go to one page to another page, in this case session helps to track the user information that this is same user or not, that's why use passport with session
passport.use(new LocalStrategy(User.authenticate())); // Use Local Strategy with passport and pass the User.authenticate() method


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middileware for define the different flash message, which will be accessable in template 
app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // Pass success to the locals for access in template
    res.locals.error = req.flash("error"); // Pass error to the locals for access in template
    res.locals.currUser = req.user; // Define a res locals to access it in ejs template [in navbar.ejs]
    // console.log(res.locals);
    next();
});


app.get("/", wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
}));


app.use("/listings", listingRouter); // For all the path that has common for '/listings'
app.use("/listings/:id/reviews", reviewRouter); // For all the path that has common for '/listings/:id/reviews'
app.use("/", userRouter); // For all User path



app.get("/pricacy", (req, res) => {
    res.render("./listings/pricacy.ejs");
}); // for privacy terms page


app.get("/terms", (req, res) => {
    res.render("./listings/terms.ejs");
}); // for privacy terms page


// To check the incomming request for non existing pathe except what i defind. Then display a page not found message.
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// Error handling middleware that triger by the asyncWrap function throw error.
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err; // Set default 500 status code and a message.
    res.status(statusCode).render("./layouts/error.ejs", { message });
    // res.status(statusCode).send(message);
});
