// Routes for Authentication

const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.js");
const { verifyAccessToken } = require("../middlewares/verify_access_token.js");

router.get("/",async(req,res)=>{
    return res.send("This is the Authentication Route");
});


router.post("/login",authController.login);

router.post("/signup",authController.signup);

router.post("/refresh-token",authController.refresh_access_token);

router.get("/user-info",verifyAccessToken,authController.get_user_info);

module.exports = router;