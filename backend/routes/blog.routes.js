const { Router } = require("express")

const blogRouter = Router()

blogRouter.get("/", (req, res) => {
    res.send({ msg: "Blogs" })
})

blogRouter.post("/create", (req, res) => {
    res.send({ msg: "Blog Created" })
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