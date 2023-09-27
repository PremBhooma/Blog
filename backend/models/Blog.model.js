const mongoose = require("mongoose")
const moment = require("moment");

const blogScheme = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author_name: { type: String },
    author_email: { type: String },
    postDate: { type: String, default: moment().format("DD/MM/YYYY") },
    postTime: { type: String, default: moment().format("HH:mm") }

}, {
    timestamps: true
})

const BlogModel = mongoose.model("blog", blogScheme)

module.exports = {
    BlogModel
}