const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Add the middleware to check logged in or not
const listingController = require("../controllers/listings.js");
const multer  = require("multer"); // Require multer
const {storage} = require("../cloudConfig.js") // Require the storage from cloud storage configuration file
const upload = multer({ storage }); // Multer store the file into 'storage' named cloud storage


// Render the form to create the new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);



// Apply router.routr() method for do the same thing for the above two route("/" in this route, GET & POST)
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.array('listing[image]', 3), // Multer process the image file
        validateListing, // Atfirst call the validateListing function for schema validation then do all other things
        wrapAsync(listingController.createListing));
    




// View specific one
router.get("/:id", wrapAsync(listingController.showListing));


// Edit Rout -> Render the edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




// Save the updated data in DB
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.array('listing[image]', 3), // Multer process the image file
    validateListing, // Same for updation -> call this functoin first then do the others
    wrapAsync(listingController.updateListing)
);


// Delete the Listings
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;