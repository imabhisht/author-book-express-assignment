// Book Route
const express = require('express');
const router = express.Router();
const bookController = require('../controller/books');
const { verifyAccessToken } = require("../middlewares/verify_access_token.js");

router.get('/',async(req,res)=>{
    return res.send("This is the Book Route");
});

router.post('/create', verifyAccessToken, bookController.create_book);

router.put('/like/:book_id', verifyAccessToken, bookController.like_book);

router.put('/dislike/:book_id', verifyAccessToken, bookController.dislike_book);

router.get('/all', verifyAccessToken, bookController.getBooks);

router.get('/my', verifyAccessToken, bookController.getMyBooks);

router.delete("/:book_id", verifyAccessToken, bookController.deleteBook);

module.exports = router;