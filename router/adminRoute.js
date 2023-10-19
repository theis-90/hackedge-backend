const express = require('express')
const router = express.Router();
const adminAuth = require("../auth/adminAuth")
const { signIn, createBlog, deleteBlog, createProduct, listOfBlogs, editBlog, getAllContact, deleteContact, getDashboardData, updatePassword, signOut, deleteProduct, listOfProducts, editProduct, createDevice, deleteDevice, listOfDevice, editDevice } = require("../controller/adminController")
const { upload } = require("../utils/multer")


router.post("/admin/api/sign-in", signIn)
router.post("/admin/api/update-password", adminAuth, updatePassword)
router.get("/admin/api/sign-out", adminAuth, signOut)
router.get("/admin/api/dashboard", adminAuth, getDashboardData)

router.post("/admin/api/create-blog", adminAuth, upload.single("blogImage"), createBlog)
router.delete("/admin/api/delete-blog/:id", adminAuth, deleteBlog)
router.get("/admin/api/list-of-blogs", adminAuth, listOfBlogs)
router.post("/admin/api/edit-blog/:id", adminAuth, upload.single("blogImage"), editBlog)

router.post("/admin/api/create-device", adminAuth, upload.single("deviceImage"), createDevice)
router.delete("/admin/api/delete-device", adminAuth , deleteDevice)
router.get("/admin/api/list-of-device", adminAuth , listOfDevice)
router.post("/admin/api/edit-device/:id", adminAuth, upload.single("deviceImage"), editDevice)


router.get("/admin/api/get-all-contact", adminAuth, getAllContact)
router.delete("/admin/api/delete-contact/:id", adminAuth, deleteContact)


router.post("/admin/api/create-product", adminAuth, upload.single("productImage"), createProduct)
router.delete("/admin/api/delete-product/:id", adminAuth, deleteProduct)
router.get("/admin/api/list-of-products", adminAuth, listOfProducts)
router.post("/admin/api/edit-product/:id", adminAuth, upload.single("productImage"), editProduct)


module.exports = router