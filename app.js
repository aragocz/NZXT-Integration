const express = require("express");
const app = express();
const port = 32768;

app.get("/", (req, res) => {
    res.sendFile("./public/index.html", {root: "."})
})

app.use(express.static("public"))

app.listen(port, "127.0.0.1")