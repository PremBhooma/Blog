const { Router } = require("express")
const multer = require("multer")
const path = require('path')

const { BlogModel } = require("../models/Blog.model")
const { UserModel } = require("../models/User.model")

const blogRouter = Router()

blogRouter.get("/", (req, res) => {
    res.send({ msg: "Blogs" })
})

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: Storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ) {
            callback(null, true)
        } else {
            console.log("only jpg & png file supported")
            callback(null, false)
        }
    }
})

blogRouter.post("/create", upload.single('image'), async (req, res) => {
    const { title, description, category } = req.body
    const { image } = req.file

    const author_id = req.user_id
    const user = await UserModel.findOne({ _id: author_id })
    const { name, email } = user

    const new_blog = new BlogModel({
        title,
        description,
        category,
        author_name: name,
        author_email: email
    })
    if (req.file) {
        new_blog.image = req.file.path
    }

    try {
        await new_blog.save()
        res.send({ msg: "Blog Created" })
    } catch (err) {
        res.send({ msg: "Blog Failed to Create" })
        console.log(err)
    }
})

blogRouter.put("/edit/:blogID", (req, res) => {
    res.send({ msg: "Blog Edited" })
})

blogRouter.delete("/delete/:blogID", (req, res) => {
    res.send({ msg: "Blog Deleted" })
})

module.exports = {
    blogRouter
}