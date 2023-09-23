const express = require("express")

const { connection } = require("mongoose")

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Base Port Welcomes You")
})

app.post("/signup", (req, res) => {
    const { name, phone_number, email, password } = req.body
    console.log(req.body)
    res.send({ msg: `Signup Succesfully` })
})

app.listen(8090, async (req, res) => {
    try {
        await connection
        console.log("DB Connection Success")
    } catch (err) {
        console.log("Db Connection Failed")
        console.log(err)
    }
    console.log("listening on 8090 Port")
})