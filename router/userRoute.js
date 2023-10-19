const express = require('express')
const router = express.Router();

const { sendContact, listOfBlogs, listOfDevice } = require("../controller/userController")


router.post("/api/send-contact", sendContact)
router.get("/api/list-of-blogs", listOfBlogs)
router.get("/api/list-of-device", listOfDevice)



module.exports = router