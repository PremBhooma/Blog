const mongoose = require("mongoose")

const blogScheme = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    author_name: { type: String },
    author_email: { type: string }
}, {
    timestamps: true
})

const BlogModel = mongoose.model("blog", blogScheme)

module.exports = {
    BlogModel
}