const { Router } = require("express")
const multer = require("multer")
const path = require('path')

const { BlogModel } = require("../models/Blog.model")
const { UserModel } = require("../models/User.model")

const blogRouter = Router()

blogRouter.get("/", async (req, res) => {

    const page = parseInt(req.query.page) - 1 || 0
    const limit = parseInt(req.query.limit) || 5
    const q = req.query.q || ""
    let sort = req.query.sort || "postTime"
    let category = req.query.category || "All"

    const categoryOptions = await BlogModel.distinct("category");
    category === "All"
        ? (category = [...categoryOptions])
        : (category = req.query.category.split(","))

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort])

    let sortBy = {}
    if (sort[1]) {
        sortBy[sort[0]] = sort[1]
    } else {
        sortBy[sort[0]] = "asc"
    }

    const blogs = await BlogModel.find({ title: { $regex: q, $options: "i" } })
        .where("category")
        .in([...category])
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit)

    const total = await BlogModel.countDocuments({
        category: { $in: [...category] },
        title: { $regex: q, $options: "i" },
    })

    const response = {
        total,
        page: page + 1,
        limit,
        category: categoryOptions,
        blogs
    }
    res.send(response)
})

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: Storage
    // fileFilter: function (req, file, callback) {
    //     if (file.mimetype == "image/png" ||
    //         file.mimetype == "image/jpg"
    //     ) {
    //         callback(null, true)
    //     } else {
    //         console.log("only jpg & png file supported")
    //         callback(null, false)
    //     }
    // }
})

blogRouter.post("/create", upload.single('image'), async (req, res) => {
    const { title, description, category } = req.body

    if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded." });
    }

    const { image } = req.file

    const author_id = req.user_id
    const user = await UserModel.findOne({ _id: author_id })
    const { name, email } = user

    const new_blog = new BlogModel({
        title,
        description,
        category,
        author_name: name,
        author_email: email,
        image: req.file.path // Assign the image path here
    })

    try {
        await new_blog.save()
        res.send({ msg: "Blog Created" })
    } catch (err) {
        res.send({ msg: "Blog Failed to Create" })
        console.log(err)
    }
})

blogRouter.put("/edit/:blogID", async (req, res) => {
    try {
        const blogID = req.params.blogID
        const payload = req.body;

        const user_id = req.user_id
        const user = await UserModel.findOne({ _id: user_id })
        const user_email = user.email;
        console.log(user_email)

        const blog = await BlogModel.findOne({ _id: blogID })
        const blog_author_email = blog.author_email
        console.log(blog_author_email)

        if (user_email !== blog_author_email) {
            res.send({ msg: "Unauthorized" })
        } else {
            await BlogModel.findByIdAndUpdate(blogID, payload)
            res.status(200).send({ msg: `blog ${blogID} updated` })
        }
    } catch (err) {
        console.log(err)
        res.send({ msg: "update failed" })
    }
})

blogRouter.delete("/delete/:blogID", async (req, res) => {
    try {
        const blogID = req.params.blogID

        const user_id = req.user_id
        const user = await UserModel.findOne({ _id: user_id })
        const user_email = user.email;

        const blog = await BlogModel.findOne({ _id: blogID })
        const blog_author_email = blog.author_email

        if (user_email !== blog_author_email) {
            res.send({ msg: "Unauthorized" })
        } else {
            await BlogModel.findByIdAndDelete(blogID)
            res.status(200).send({ msg: `blog ${blogID} deleted` })
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = {
    blogRouter
}