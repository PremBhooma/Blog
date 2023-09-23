const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.send("Base Port Welcomes You")
})

app.listen(8090, (req, res) => {
    console.log("listening on 8090 Port")
})