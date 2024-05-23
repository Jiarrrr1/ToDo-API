const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        },
        email: {
        unique: true,
        type: String,
        },
        password: String,
        taskList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Todo",
            },
        ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
