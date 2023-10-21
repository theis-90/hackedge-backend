const mongoose = require('mongoose')
const Admins = mongoose.model('Admins');
const Blogs = mongoose.model('Blogs');
const Contact = mongoose.model('Contact');
const Product = mongoose.model('Product');
const Device = mongoose.model('Device');
const bcrypt = require('bcryptjs')
const cloudnary = require("../utils/cloudnary")

//done
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).send({ status: 0, message: "Email Is Required" })
        } else if (!password) {
            return res.status(400).send({ status: 0, message: "Password Is Required" })
        }
        const emaill = email.toLowerCase()
        const admin = await Admins.findOne({ email: emaill })

        var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!emaill.match(emailRegex)) {
            return res.status(400).send({ status: 0, message: "Invalid Email Address" })
        }
        if (!admin) {
            return res.status(400).send({ status: 0, message: "User Not Found" })
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Password Is Not Valid" });
        }
        else {
            await admin.generateAuthToken();
            const adminDetail = await Admins.findOne({ _id: admin._id });
            res.status(200).send({ status: 1, message: "Login Successfully", data: adminDetail })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, confirmNewPassword, newPassword } = req.body;
        const usercheck = await Admins.findOne({ _id: req.user._id })

        if (!currentPassword) {
            return res.status(400).send({ status: 0, message: "Current Password Is Required" })
        }
        const isMatch = await bcrypt.compare(currentPassword, usercheck.password);
        if (!isMatch) {
            return res.status(400).send({ status: 0, message: "Invalid Current Password" })
        }
        else if (!newPassword) {
            return res.status(400).send({ status: 0, message: "New Password Is Required" })
        }
        else if (newPassword.length < 6) {
            return res.status(400).send({ status: 0, message: "Password Should Be 6 Character Long" })
        }
        else if (!confirmNewPassword) {
            return res.status(400).send({ status: 0, message: "Confirm New Password Is Required" })
        }
        else if (confirmNewPassword.length < 6) {
            return res.status(400).send({ status: 0, message: "Password Should Be 6 Character Long" })
        }
        else if (newPassword !== confirmNewPassword) {
            return res.status(400).send({ status: 0, message: "New Password And Confirm New Password Should Be Same" })
        }
        else if (currentPassword == newPassword || currentPassword == confirmNewPassword) {
            return res.status(400).send({ status: 0, message: "Old Password And New Password Can't Be Same" })
        }
        else if (!usercheck) {
            return res.status(400).send({ status: 0, message: "User Not Found" })
        }
        else {
            await usercheck.comparePassword(currentPassword);
            const salt = await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(newPassword, salt);
            await Admins.findByIdAndUpdate({ _id: req.user._id }, { $set: { password: pass } })
            res.status(200).send({ status: 1, message: "Password Changed Successfully" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const signOut = async (req, res) => {
    try {
        const user = await Admins.findById({ _id: req.user._id })
        if (!user) {
            return res.status(400).send({ status: 0, message: "Admin Not Found" })
        } else {
            await Admins.findOneAndUpdate({ _id: req.user._id }, {
                token: null,
            }, { new: true });
            res.status(200).send({ status: 1, message: "Admin Logged Out" })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

const createBlog = async (req, res) => {
    try {
        const { title, detail } = req.body
        console.log(req.file)
        if (!title) {

            return res.status(400).send({ status: 0, message: "Title Is Required" })
        } else if (!detail) {
            return res.status(400).send({ status: 0, message: "Detail Is Required" })
        } else {
            try {
                const cloud = await cloudnary.uploader.upload(req.file.path)
                const addBlog = new Blogs({
                    title,
                    detail,
                    image: cloud?.url,
                })

                await addBlog.save()
                if (addBlog) {
                    return res.status(200).json({ status: 1, message: "Blogs added successfully" })
                } else {
                    return res.status(400).json({ status: 0, message: "Something went wrong" })
                }
            } catch (error) {
                console.log(error)
            }

        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const createDevice = async (req, res) => {
    try {
        const { title, detail } = req.body

        if (!title) {

            return res.status(400).send({ status: 0, message: "Title Is Required" })
        } else if (!detail) {
            return res.status(400).send({ status: 0, message: "Detail Is Required" })
        } else {
            try {
                const cloud = await cloudnary.uploader.upload(req.file.path)
                const addDevice = new Device({
                    title,
                    detail,
                    image: cloud?.url
                })

                await addDevice.save()
                if (addDevice) {
                    return res.status(200).json({ status: 1, message: "HackEdge device added successfully" })
                } else {

                    return res.status(400).json({ status: 0, message: "Something went wrong" })
                }
            } catch (error) {
                console.log(error)
            }
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params

        const removeBlog = await Blogs.findOneAndDelete({ _id: id })
        if (removeBlog) {
            return res.status(200).json({ status: 1, message: "Blog deleted successfully" })
        } else {
            return res.status(400).json({ status: 0, message: "Something went wrong" })

        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}
const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params

        const removeBlog = await Device.findOneAndDelete({ _id: id })
        if (removeBlog) {
            return res.status(200).json({ status: 1, message: "Device deleted successfully" })
        } else {
            return res.status(400).json({ status: 0, message: "Something went wrong" })
        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
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
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const editBlog = async (req, res) => {
    try {
        const _id = req.params.id
        const { title, detail } = req.body
        const data = await Blogs.findOne({ _id });
        if (data) {



            data.title = title ? title : data?.title
            data.detail = detail ? detail : data?.detail
            data.image = req.file ? req.file.path : data?.image
            await data.save()

            return res.status(200).send({ status: 1, message: `Blog updated Successfully`, data })
        } else {
            return res.status(400).send({ status: 0, message: "Blog not found" })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const editDevice = async (req, res) => {
    try {
        const _id = req.params.id
        const { title, detail } = req.body
        const data = await Device.findOne({ _id });
        if (data) {
            data.title = title ? title : data?.title
            data.detail = detail ? detail : data?.detail
            data.image = req.file ? req.file.path : data?.image
            await data.save()

            return res.status(200).send({ status: 1, message: `Devices updated Successfully`, data })
        } else {
            return res.status(400).send({ status: 0, message: "Devices not found" })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}
const getAllContact = async (req, res) => {
    try {
        const listAll = await Contact.find()
        if (listAll.length > 0) {
            return res.status(200).json({ status: 1, data: listAll })
        } else {
            return res.status(400).json({ status: 0, message: "No Contact found" })

        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: "Something went wrong" })
    }
}

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params

        const deletecon = await Contact.findOneAndDelete({ _id: id })
        if (deletecon) {
            return res.status(200).json({ status: 1, message: "Contact deleted successfully" })
        } else {
            return res.status(400).json({ status: 0, message: "Something went wrong" })

        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const getDashboardData = async (req, res) => {
    try {

        const blogs = await Blogs.find({}).countDocuments();
        const contact = await Contact.find({}).countDocuments();
        const product = await Device.find({}).countDocuments();


        return res.status(200).json({ status: 1, blogs: blogs > 0 ? blogs : 0, contact: contact > 0 ? contact : 0, product: product > 0 ? product : 0 });

    } catch (error) {
        res.send(error.message);
    }
};


const createProduct = async (req, res) => {
    try {
        const { title, detail } = req.body
        console.log(req.file)
        if (!title) {

            return res.status(400).send({ status: 0, message: "Title Is Required" })
        } else if (!detail) {
            return res.status(400).send({ status: 0, message: "Detail Is Required" })
        } else {
            const addProduct = new Product({
                title,
                detail,
                image: req.file ? req.file.path : null,
            })

            await addProduct.save()
            if (addProduct) {
                return res.status(200).json({ status: 1, message: "Product added successfully" })
            } else {

                return res.status(400).json({ status: 0, message: "Something went wrong" })
            }
        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}



const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const removeProduct = await Product.findOneAndDelete({ _id: id })
        if (removeProduct) {
            return res.status(200).json({ status: 1, message: "Product deleted successfully" })
        } else {
            return res.status(400).json({ status: 0, message: "Something went wrong" })

        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const listOfProducts = async (req, res) => {
    try {
        const listAll = await Product.find()
        if (listAll.length > 0) {
            return res.status(200).json({ status: 1, data: listAll })
        } else {
            return res.status(400).json({ status: 0, message: "No Products found" })

        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}
const listOfDevice = async (req, res) => {
    try {
        const listAll = await Device.find()
        if (listAll.length > 0) {
            return res.status(200).json({ status: 1, data: listAll })
        } else {
            return res.status(400).json({ status: 0, message: "No Device found" })

        }

    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}

const editProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const { title, detail } = req.body
        const data = await Product.findOne({ _id });
        if (data) {
            data.title = title ? title : data?.title
            data.detail = detail ? detail : data?.detail
            data.image = req.file ? req.file.path : data?.image
            await data.save()

            return res.status(200).send({ status: 1, message: `Product updated Successfully`, data })
        } else {
            return res.status(400).send({ status: 0, message: "Product not found" })
        }
    } catch (err) {
        return res.status(500).send({ status: 0, message: err.message })
    }
}
module.exports = { signIn, createBlog, editProduct, editDevice, createDevice, deleteDevice, listOfDevice, listOfProducts, deleteBlog, deleteProduct, createProduct, getDashboardData, signOut, updatePassword, deleteContact, listOfBlogs, getAllContact, editBlog }