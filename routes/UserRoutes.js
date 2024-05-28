const express = require('express')

const authController = require("../controller/AuthController.js");
const verifyUser = require("../middleware/VerifyToken");

const router = express.Router();
//User Controller
router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.patch('/passwordchange', verifyUser.verifyToken, authController.changeUserPassword)
router.get('/logout', verifyUser.verifyToken, authController.logoutUser)

module.exports = router;
