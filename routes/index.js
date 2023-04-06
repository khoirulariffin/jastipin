const express = require("express");
const Controller = require("../controllers/controller");
const router = express.Router();
const { uploadSingle } = require("../helper/multer");

router.get(`/`, Controller.home);
router.get("/register", Controller.register);
router.post(`/register`, Controller.registerPost);
// Route Login
router.get(`/login`, Controller.login);
router.post(`/login`, Controller.loginPost);
router.get(`/logout`, Controller.logout);

router.get("/category/:id", Controller.category);
router.get("/product/add", Controller.showAddProduct);
router.post("/product/add", uploadSingle, Controller.addProduct);
module.exports = router;
