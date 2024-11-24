const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // requiring mapBox SDK for geocodding.
const mapToken = process.env.MAP_TOKEN; // Requiring map token 
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary = require('cloudinary').v2;




// new form render for creating new listing
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};



// create new listing from the new listing form data
module.exports.createListing = async (req, res, next) => {

    // Receive a response from mapbox forward geocoding method
    let responce = await geocodingClient.forwardGeocode({
        query: req.body.listing.location, // Pass the location came from newListing creation form
        limit: 1, // Set the response limit of 1
      })
        .send()
        

    if(!req.body.listing){
        req.flash("error", "This Property is not found!");
        res.redirect("/listings"); 
    }
    let newListing = new Listing(req.body.listing); // Access the listing object from templet and then create a new Listing from this
    newListing.owner = req.user._id; // When create new listing store the current user id into listing owner field.
    newListing.image = [];  // Inside newlisting.image add url and file name

    newListing.geometry = responce.body. features[0].geometry; // Comming this geometry value from map box and store in geometry field of the listing model/collection 


    // Handle file uploads
    if (req.files) {
        req.files.forEach(file => {
            newListing.image.push({
                url: file.path,
                filename: file.filename // Adjust based on where images are stored
            });
        });
    }

    // Set the current date.
    newListing.submitedAt = Date.now();


    await newListing.save();
    
    req.flash("success", "New Property added successfully!"); // flash a success message after successfully crate the listing
    res.redirect("/listings");
};



// Index route
module.exports.index = async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
};



// View specific listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!data){
        req.flash("error", "This Property does't Exist!"); //If the listing does't exist then flash a error message for this listing
        res.redirect("/listings");
    };

    let userHasReviewed = false;
    if(req.user){
        userHasReviewed = data.reviews.some(review => review.author._id.equals(req.user._id));
    }
    // console.log(data);
    res.render("./listings/show.ejs", { data, userHasReviewed });
};



// render the edit form for listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error", "This Property does't Exist!"); //If the listing does't exist then flash a error message for this listing
        res.redirect("/listings");
    };
    
    res.render("./listings/edit.ejs", { data });
    // console.log(req.user);
};


// Save the updated listing data on DB
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

     // Receive a response from mapbox forward geocoding method
     let responce = await geocodingClient.forwardGeocode({
        query: req.body.listing.location, // Pass the location came from newListing creation form
        limit: 1, // Set the response limit of 1
      })
        .send()
        
    if(!req.body.listing){
        req.flash("error", "This Property is not found!");
        res.redirect("/listings"); 
    }

    let geometry = responce.body. features[0].geometry; // Comming this geometry value from map box and store in geometry field of the listing model/collection 

    let updateListing = await Listing.findByIdAndUpdate(id, { 
        ...req.body.listing, // Spread the rest of the updated listing data
        geometry: geometry // Add the new geometry data to the update
    }, { new: true }); //return the updated document after the update operation.

    // Handle deletion of selected images
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(filename);

            // Remove image from the listing's images array in the database
            updateListing.image = updateListing.image.filter( img => img.filename !== filename );
        }
        // Save the updated listing without deleted images
        await updateListing.save();
    }


     // Handle file uploads
     if (req.files) {
        req.files.forEach(file => {
            updateListing.image.push({
                url: file.path,
                filename: file.filename // Adjust based on where images are stored
            });
        });
        await updateListing.save(); // Save the updated listing
    }

    updateListing.submitedAt = Date.now();
    await updateListing.save(); // Save the updated listing
    
    req.flash("success", "Property details updated!"); // flash a success message after successfully Update the listing
    res.redirect(`/listings/${id}`);
};



// delete the listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Property Deleted Successfully!"); // flash a success message after successfully delete the listing
    res.redirect("/listings");
};