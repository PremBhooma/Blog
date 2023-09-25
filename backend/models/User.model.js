const mongoose = require("mongoose")

const userScheme = new mongoose.Schema({
    name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const UserModel = mongoose.model("user", userScheme)

module.exports = {
    UserModel
}