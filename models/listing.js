const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const forEmpty = ;
// const fordefault = ;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true,
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        // Set for set a default value into this in case user does't provide any image URL
    },
    price: {
        type: Number,
        required: true,
    },
    location:{
        type: String,
        // required: true,
    },
    country: {
        type: String,
        // required: true,
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
