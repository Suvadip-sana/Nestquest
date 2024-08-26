const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// Reviews -> Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Reviews -> Delete reviews (POST request)
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));



module.exports = router;