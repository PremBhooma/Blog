const express = require("express")
const bcrypt = require("bcrypt")

const { connection } = require("./config/db")
const { UserModel } = require("./models/User.model")

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Base Port Welcomes You")
})

app.post("/signup", (req, res) => {
    let { name, phone_number, email, password } = req.body
    console.log(req.body)

    bcrypt.hash(password, 3, async function (err, hash) {
        const new_user = new UserModel({
            name,
            phone_number,
            email,
            password: hash
        })
        try {
            await new_user.save()
            res.send({ msg: "Successfully SignUp" })
        } catch (err) {
            console.log(err)
            res.send({ msg: "Something Went Wrong" })
        }
    });
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