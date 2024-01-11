// Routes for Testing

const express = require("express");
const router = express.Router();

const testController = require("../controller/test.js");

router.get("/",async(req,res)=>{
    return res.send("This is the Test Route");
});

router.post("/create-fake-data",testController.createFakeAuthorAndBooks);

module.exports = router;
