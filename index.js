const mongoose = require('mongoose')
const express = require("express");
const app = express();
require("./model")
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connect = require("./db/db")



dotenv.config();


app.use('/upload', express.static('upload'));
connect()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const adminRoute = require("./router/adminRoute")
const userRoute = require("./router/userRoute")
app.use(adminRoute)
app.use(userRoute)


const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
    console.log(`Server running on ${PORT}`);
});




