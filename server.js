const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to the home page");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("test");
});

