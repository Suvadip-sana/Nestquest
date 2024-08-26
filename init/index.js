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
    initData.data = initData.data.map((obj) => ({...obj, owner: "66c63d6f76d4d759e5e84620"})); // inside initData access the data array and apply the map function, For every object add this function a owner object id along with other property(...obj).
    await Listing.insertMany(initData.data);
    console.log("Data was saved!");
};

initDB();