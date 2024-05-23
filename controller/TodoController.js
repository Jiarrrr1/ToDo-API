const Todo = require('../model/Todo.Model');
const User = require("../model/User.Model");

exports.getTodo = async (req, res) => {
    try {
        const getAllTask = await User.findOne({ email: req.user.email })
        .populate("taskList")
        .exec();

        if (getAllTask.taskList.length == 0) {
        return res.sendStatus(204);
        }
        res.status(200).json({
            content: getAllTask.taskList,
        });
        
    } catch (err) {
        res.status(400).json({
            content: err,
    });
    }
}

exports.postCreate = async (req, res) => {
    const {taskname, time} = req.body;
    try{
        //Query the user currently loggedin
        const getCurrentUser = await User.findOne({_id: req.user._id});
        console.log(getCurrentUser);
        const newTask = new Todo({
            name:taskname,
            timeToDo: time,
        });
        // saving task to Todo Model
        await newTask.save();

        getCurrentUser.taskList.push(newTask);
        //saving task to tasklist of the User model
        await getCurrentUser.save();

        res.status(200).json({
            status: "Successfully Added",
            content: newTask
        });
    }   catch(err){}
};

exports.patchUpdate = async (req, res) => {
    try {
        const { taskId, newTaskData } = req.body;

        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        if (!user.taskList.includes(taskId)) {
            return res.status(404).json({ 
                message: 'Task not found in user task list' 
            });
        }

        const updatedTask = await Todo.findByIdAndUpdate(
            taskId,
            { name: newTaskData },
            { 
                runValidators: true,
                new: true, 
            }
        );

        if (!updatedTask) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        res.status(200).json({ 
            message: 'Task updated successfully', 
            content: updatedTask 
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};

exports.deleteTodo = async (req, res) => {
    const activeUser = req.user._id; 
    const taskId = req.params.id;
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found' 
            });
        }

        if (!user.taskList.includes(taskId)) {
            return res.status(404).json({ 
                message: 'Task not found in user task list' 
            });
        }
        
        await Todo.findOneAndDelete(taskId, {
            new: true,
            runValidators: true,
        });

        const currentUser = await User.findById(activeUser);

        currentUser.taskList = currentUser.taskList.filter(task => task.toString() !== taskId);
        await currentUser.save();
        res.status(200).json({
            status: "Successfully deleted",
            content: currentUser.taskList
        });
    } catch (err) {
        console.error("Error deleting todo:", err);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error"
        });
    }
};

exports.markAsDone = async (req, res) => {
    const id = req.params._id;
    
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found' 
            });
        };

        if (!user.taskList.includes(id)) {
            return res.status(404).json({ 
                message: 'Task not found in user task list' 
            });
        };
        const markedTask = await Todo.findByIdAndUpdate(
            id,
            { isFinished: true },
            {runValidators: true,
                new: true,
            }
        );
        console.log(markedTask)
        if (markedTask) {
            return res.status(200).json({
                status: "Successfully Marked As Done",
                content: markedTask,
            });
        }
    } catch (err) {
        return res.status(400).json({
            message: "Internal server error", err,
            
        });
};
};
