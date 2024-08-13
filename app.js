const express = require("express");
const app = express();
const port = 4343;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");


app.listen(port, () => {
    console.log("App listening on port ", port);
});

const mongoDbURL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongoDbURL);
};

main() .then(() => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log("Error occured on Dtabase connection!", err);
});


app.set("views", path.join(__dirname, "views")); // Serve the ejs file from the views folder
app.set("view engine", "ejs"); // Set view engine to 'ejs'

app.use(express.static(path.join(__dirname, "/public"))); // Serve the static file from public folder
app.use(methodOverride("_method"));  // Use method override 
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate); // Set engine to ejs-mate


// app.get("/", (req, res) => {
//     res.send("Working");
// });


// app.get("/testListing", async (req, res) => {
//     let samplelisting = new Listing ({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await samplelisting.save();
//     console.log("Sample saved");
//     res.send("Success!");
// });



// Render the form to create the new user
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});


// Save the data of the Form into DB
app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body.listing); // Access the listing object from templet and then create a new Listing from this
    await newListing.save();
    res.redirect("/listings");
})





// Index route
app.get("/listings", async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
});




// View specific one
app.get("/listings/:id", async(req, res) => {
    const {id} = req.params;
    const data = await Listing.findById(id);
    res.render("./listings/show.ejs", {data});
});




// Edit Rout -> Render the edit form
app.get("/listings/:id/edit", async(req, res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    res.render("./listings/edit.ejs", {data});
});


// Save the updated data in DB
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});



// Delete the Listings
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

