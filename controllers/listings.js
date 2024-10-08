const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); // requiring mapBox SDK for geocodding.
const mapToken = process.env.MAP_TOKEN; // Requiring map token 
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




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
        

    let url = req.file.path; // Extract the cloud file path from 'req.file.path'
    let filename = req.file.filename; // Extract the cloud file name from 'req.file.filename'
    if(!req.body.listing){
        req.flash("error", "Listing object not found!");
        res.redirect("/listings"); 
    }
    let newListing = new Listing(req.body.listing); // Access the listing object from templet and then create a new Listing from this
    newListing.owner = req.user._id; // When create new listing store the current user id into listing owner field.
    newListing.image = {url, filename};  // Inside newlisting.image add url and file name

    newListing.geometry = responce.body. features[0].geometry; // Comming this geometry value from map box and store in geometry field of the listing model/collection 

    await newListing.save();
    
    req.flash("success", "New Listing Created!"); // flash a success message after successfully crate the listing
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
        req.flash("error", "Listing does't Exist!"); //If the listing does't exist then flash a error message for this listing
        res.redirect("/listings");
    };
    // console.log(data);
    res.render("./listings/show.ejs", { data });
};



// render the edit form for listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error", "Listing does't Exist!"); //If the listing does't exist then flash a error message for this listing
        res.redirect("/listings");
    };
    let originalUrl = data.image.url;
    modifiedUrl = originalUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { data, modifiedUrl });
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
        req.flash("error", "Listing object not found!");
        res.redirect("/listings"); 
    }

    let geometry = responce.body. features[0].geometry; // Comming this geometry value from map box and store in geometry field of the listing model/collection 

    let updateListing = await Listing.findByIdAndUpdate(id, { 
        ...req.body.listing, // Spread the rest of the updated listing data
        geometry: geometry // Add the new geometry data to the update
    }, { new: true }); //return the updated document after the update operation.

    // Atfirst update the data with the new data that came from listing object after that check in req.file, If the file exist(not undefined -> need not compulsury to upload new image) then extract url and filename, pass it for database url and filename then save it
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path; // Extract the cloud file path from 'req.file.path'
        let filename = req.file.filename; // Extract the cloud file name from 'req.file.filename'
        updateListing.image = {url, filename}  // Inside updatedlisting.image add url and file name
        await updateListing.save();
    }
    
    req.flash("success", "Listing Updated Successfully!"); // flash a success message after successfully Update the listing
    res.redirect(`/listings/${id}`);
};



// delete the listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!"); // flash a success message after successfully delete the listing
    res.redirect("/listings");
};