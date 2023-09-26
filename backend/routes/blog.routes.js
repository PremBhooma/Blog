const { Router } = require("express")

const { BlogModel } = require("../models/Blog.model")
const { UserModel } = require("../models/User.model")

const blogRouter = Router()

blogRouter.get("/", (req, res) => {
    res.send({ msg: "Blogs" })
})

blogRouter.post("/create", async (req, res) => {
    const { title, description, image, category } = req.body
    const author_id = req.user_id
    const user = await UserModel.findOne({ _id: author_id })
    const { name, email } = user
    const new_blog = new BlogModel({
        title,
        description,
        image,
        category,
        author_name: name,
        author_email: email
    })
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