//Author Router

const express = require('express');
const router = express.Router();
const authorController = require('../controller/author');
const { verifyAccessToken } = require("../middlewares/verify_access_token.js");

// router.get('/',async(req,res)=>{
//     return res.send("This is the Author Route");
// });

router.get("/:operation", verifyAccessToken, authorController.get_author_profile);

module.exports = router;