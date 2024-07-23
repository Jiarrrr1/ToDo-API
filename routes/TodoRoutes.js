const express = require('express')

const todoController = require('../controller/TodoController.js');
const verifyUser = require("../middleware/VerifyToken");

const router = express.Router();
// Todo Controller
router.get('/access', todoController.getTodo)
router.post('/add', verifyUser.verifyToken, todoController.createTask)
router.patch('/change/', verifyUser.verifyToken, todoController.changeTask)
router.patch('/changetime', verifyUser.verifyToken, todoController.changeTime)
router.delete('/delete/:id', verifyUser.verifyToken, todoController.deleteTodo)
router.patch('/markAsDone/:_id', verifyUser.verifyToken, todoController.markAsDone)

module.exports = router;