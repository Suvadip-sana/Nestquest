const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://a0.muscache.com/im/pictures/a91730be-ccb9-48de-ab20-125c5ee47ebe.jpg?",
        set: (v) => v === "" ? "https://a0.muscache.com/im/pictures/a91730be-ccb9-48de-ab20-125c5ee47ebe.jpg?" : v,
        // Set for set a default value into this in case user does't provide any image URL
    },
    price: {
        type: Number,
    },
    location:{
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
});



// Create a post middlware that when a listing was deleted it automatically delete it's review also
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing && listing.reviews.length > 0){
        let res = await Review.deleteMany({ _id: { $in: listing.reviews }});
        console.log(res);
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
