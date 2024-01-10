// Middleware for verifying access token in the request header

const jwt = require("jsonwebtoken");
const prisma = require("../prisma_init");


module.exports.verifyAccessToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // Decode JWT token
        const decodedPayload = jwt.decode(token);
        console.log(decodedPayload)
        // Get user id from decoded payload
        const userId = decodedPayload.id;

        // Check if user exists in database
        const user = await prisma.author.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new Error("Authentication failed.");
        }

        // Verify JWT token
        const verifyToken = await jwt.verify(token, user.access_token_secret);

        if (!verifyToken) {
            throw new Error("Authentication failed.");
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error.message
        });
    }
}
