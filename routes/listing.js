const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); // For throwing custom express error
const { listingSchema } = require("../schema.js"); // Requiring schema.js vor validate the schema with Joi



// Validation for listing schema using a middleware function
const validateListing = (req, res, next) => {
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



// Render the form to create the new user
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

// Save the data of the Form into DB
router.post(
    "/",
    validateListing, // Atfirst call the validateListing function for schema validation then do all other things
    wrapAsync(async (req, res, next) => {
        // let result = listingSchema.validate(req.body); // check that is the data inside the req.body is valid according to schema that defined
        // // console.log(result);
        // if(result.error){ // If there is a Error occured because of Joi validation then it throw it's error message along with 400 status code
        //     throw new ExpressError(400, result.error);
        // }; // Do the same thing using a function
        let newListing = new Listing(req.body.listing); // Access the listing object from templet and then create a new Listing from this
        await newListing.save();
        res.redirect("/listings");
    })
);


// Index route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allList = await Listing.find({});
        res.render("./listings/index.ejs", { allList });
    })
);

// View specific one
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const data = await Listing.findById(id).populate("reviews");
        res.render("./listings/show.ejs", { data });
    })
);


// Edit Rout -> Render the edit form
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let data = await Listing.findById(id);
        res.render("./listings/edit.ejs", { data });
    })
);

// Save the updated data in DB
router.put(
    "/:id",
    validateListing, // Same for updation -> call this functoin first then do the others
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    })
);


// Delete the Listings
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);



module.exports = router;