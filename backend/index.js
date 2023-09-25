const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { connection } = require("./config/db")
const { UserModel } = require("./models/User.model")

require("dotenv").config()

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
            res.send({ msg: "Successfully SignUp", new_user: new_user })
        } catch (err) {
            console.log(err)
            res.send({ msg: "Something Went Wrong" })
        }
    });
})

app.post("/login", async (req, res) => {
    let { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user) {
        res.send({ msg: "Signup First" })
    } else {
        const hash_password = user.password
        console.log(hash_password)

        bcrypt.compare(password, hash_password, function (err, result) {
            // result == true
            if (result) {
                let token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY);
                console.log(token)
                res.send({ msg: "Successfully login", token: token })
            } else {
                res.send({ msg: "login failed" })
            }
        });

    }
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