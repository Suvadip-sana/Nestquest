const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const mongoDbURL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongoDbURL);
};

main() .then(() => {
    console.log("Connection Successful!");
}).catch((err) => {
    console.log("Error occured on Dtabase connection!", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was saved!");
};

initDB();