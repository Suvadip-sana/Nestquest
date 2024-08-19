const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); // For throwing custom express error
const { reviewSchema } = require("../schema.js"); // Requiring schema.js vor validate the schema with Joi



// Validation for review schema using a middleware function
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body); // check that the data inside the req.body is valid according to schema that defined using Joi
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



// Reviews -> Post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // Comming data from review object of the review form

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // res.send("Review Saved!");
    res.redirect(`/listings/${listing._id}`);
}));


// Reviews -> Delete reviews (POST request)
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let{ id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));



module.exports = router;