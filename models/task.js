const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    completed: { type: Boolean, default: false },
    priority: { type: String },
    assignedTo: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);