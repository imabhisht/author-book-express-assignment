const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/",async(req,res)=>{
    return res.send("Hello World");
});


module.exports = app;