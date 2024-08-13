const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
       name: {
        type: String,
        required: true,
      },
      isFinished: {
        type: Boolean,
        default: false,
      },
      
      createdAt: {
        type: String,
        default: setDateValue(),
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
});

function setDateValue() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', {month:'long'});
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo