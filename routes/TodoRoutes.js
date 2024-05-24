const express = require('express')

const todoController = require('../controller/TodoController.js');
const verifyUser = require("../middleware/VerifyToken");

const router = express.Router();
// Todo Controller
router.get('/access', verifyUser.verifyToken, todoController.getTodo)
router.post('/add', verifyUser.verifyToken, todoController.postCreate)
router.patch('/change/', verifyUser.verifyToken, todoController.patchUpdate)
router.patch('/changetime', verifyUser.verifyToken, todoController.changeTime)
router.delete('/delete/:id', verifyUser.verifyToken, todoController.deleteTodo)
router.patch('/markAsDone/:_id', verifyUser.verifyToken, todoController.markAsDone)

module.exports = router;