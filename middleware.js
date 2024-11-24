const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js"); // For throwing custom express error
const { listingSchema, reviewSchema } = require("./schema.js"); // Requiring schema.js vor validate the schema with Joi


// Middleware for check if the user is loged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ // Check if the user logged in or not before creating new listing with the help of 'isAuthenticated()' inbuilt method by passport, if not flash a error message and redirect to /listing page
        req.session.redirectUrl = req.originalUrl; // Store the originalUrl from req object where the user try to go before redirect in login page. Store with a new parameter(redirectUrl) inside req's session object
        req.flash("error", "Logged in first to add your Property!");
        return res.redirect("/login");
    };
    next();
};



// After loged in Passport automatically reset the session object because of new user session. For this we never access the redirectUrl that save above. to prevent this need to store it inside 'res. locals' in different middleware
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};



// Middleware for authorization 
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Property!");
        return res.redirect(`/listings/${id}`);
    };
    next();
};



// Middleware for Review authorization 
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    };
    next();
};



// Validation for listing schema using a middleware function
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body); // check that the data inside the req.body is valid according to schema that defined using Joi
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", "); // If there is additional message for every element from 'error.details' hen join them by ',' and pass as a error message 
        // If there is a Error occured because of Joi validation then it throw it's error message along with 400 status code
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    };
};




// Validation for review schema using a middleware function
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    };
};
