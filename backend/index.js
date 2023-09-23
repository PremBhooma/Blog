const express = require("express")

const { connection } = require("mongoose")

const app = express()

app.get("/", (req, res) => {
    res.send("Base Port Welcomes You")
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