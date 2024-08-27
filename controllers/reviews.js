const Listing = require("../models/listing");
const Review = require("../models/review");



// Save the review data came from review form
module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    let userHasReviewed = listing.reviews.some((review) => review.author.equals(req.user._id)); // Allow user to add only one review for a single listing
    if(userHasReviewed){
        req.flash("error", "You have already submitted a review for this listing! Delete this if you want to add new!");
        return res.redirect(`/listings/${listing._id}`);
    }
    let newReview = new Review(req.body.review); // Comming data from review object of the review form
    newReview.author = req.user._id; // Store the logged in userId into newreview author property/fields
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review Created!"); // flash a success message after successfully created the review

    res.redirect(`/listings/${listing._id}`);
};




// Delete review
module.exports.deleteReview = async (req, res) => {
    let{ id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // For delete the reviewId from review field using '$pull' operator
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!"); // flash a success message after successfully delete the review
    res.redirect(`/listings/${id}`);
};