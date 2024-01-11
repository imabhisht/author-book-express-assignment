//Author Router

const express = require('express');
const router = express.Router();
const authorController = require('../controller/author');
const { verifyAccessToken } = require("../middlewares/verify_access_token.js");

router.delete("/", verifyAccessToken, authorController.delete_author_profile);  

router.patch("/", verifyAccessToken, authorController.update_author_profile);

router.get("/", authorController.get_all_authors);

router.get("/:operation", verifyAccessToken, authorController.get_author_profile);

module.exports = router;