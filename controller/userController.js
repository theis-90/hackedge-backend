const mongoose = require('mongoose')
const Contact = mongoose.model('Contact');
const Blogs = mongoose.model('Blogs');
const Device = mongoose.model('Device');

const sendContact = async (req, res) => {
    try {
        const { email, message, name } = req.body
        if (!name) {
            return res.status(400).json({ status: 0, message: "Name  is required" })
        } else if (!email) {
            return res.status(400).json({ status: 0, message: "Email is required" })
        } else if (!message) {
            return res.status(400).json({ status: 0, message: "Message is required" })
        } else {
            const add = new Contact({
                email,
                message,
                name
            })
            await add.save()
            if (add) {
                return res.status(200).json({ status: 1, message: "Thanks for contacting us :)" })
            } else {
                return res.status(400).json({ status: 0, message: "Something went wrong" })

            }
        }

    } catch (err) {
        return res.status(400).json({ status: 1, message: err.message })

    }
}
const listOfBlogs = async (req, res) => {
    try {
        const listAll = await Blogs.find()
        if (listAll.length > 0) {
            return res.status(200).json({ status: 1, data: listAll })
        } else {
            return res.status(400).json({ status: 0, message: "No Blogs found" })

        }

    } catch (err) {
        return res.status(400).json({ status: 1, message: err.message })

    }
}
const listOfDevice = async (req, res) => {
    try {
        const listAll = await Device.find()
        if (listAll.length > 0) {
            return res.status(200).json({ status: 1, data: listAll })
        } else {
            return res.status(400).json({ status: 0, message: "No Blogs found" })

        }

    } catch (err) {
        return res.status(400).json({ status: 1, message: err.message })

    }
}

module.exports = { sendContact, listOfDevice, listOfBlogs }