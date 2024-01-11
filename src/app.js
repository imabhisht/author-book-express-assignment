const express = require('express');
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');


app.use(cors());
app.use(express.json());
app.use(cookieParser());


// Routes 
app.use("/auth",require(("./routes/auth.js")));
app.use("/test",require(("./routes/test.js")));
app.use("/books",require(("./routes/books.js")));
app.use("/author",require(("./routes/author.js")));


module.exports = app;