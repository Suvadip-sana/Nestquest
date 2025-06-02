const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { date } = require("joi");

const imageSchema = new Schema({
    filename: {
      type: String, 
    },
    url: {
      type: String,
      required: true,
    },
});

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: [imageSchema],
    price: {
        type: Number,
    },
    location:{
        type: String,
    },
    country: {
        type: String,
    },
    submitedAt: {
        type: Date,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: { // Add new key for owner
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: { // Add new key/field to store location coordinate in GeoJSON format
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          },
    },
});



// Create a post middlware that when a listing was deleted it automatically delete it's related review also from database. This post middleware is come from mongoose default
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing && listing.reviews.length > 0){
        let res = await Review.deleteMany({ _id: { $in: listing.reviews }});
        // console.log(res);
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
