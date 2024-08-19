const express = require("express");
const app = express();
const port = 4343;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js"); // For throwing custom express error
// const { listingSchema, reviewSchema } = require("./schema.js"); // Requiring schema.js vor validate the schema with Joi
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js"); // Require listing.js for restucturing the paths using Express Router
const reviews = require("./routes/review.js"); // For all reviews path

app.listen(port, () => {
    console.log("App listening on port ", port);
});

const mongoDbURL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongoDbURL);
};

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



app.use("/listings", listings); // For all the path that has common for '/listings'
app.use("/listings/:id/reviews", reviews); // For all the path that has common for '/listings/:id/reviews'



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
