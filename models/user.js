const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // Require passport local mongoose for use as a plugin, that add salted & hashed username and password


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});


userSchema.plugin(passportLocalMongoose); // Pass the passport-local-mongoose as a plugin to the Schema


module.exports = mongoose.model("User", userSchema);



