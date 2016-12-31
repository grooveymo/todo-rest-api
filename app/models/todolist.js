var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TodoSchema = new Schema({
    description : {
        type : String,
        default : '',
        trim : true,
        required : 'Todo Description cannot be blank'
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    created : {
        type : Date,
        default : Date.now
    },
    completed : {
        type : Date,
        default : null
    }
});

var TodoListSchema   = new Schema({
    title: {
        type: String,
        default : '',
        trim : true,
        required : 'Title cannot be blank'
    },
    todos : [TodoSchema],
    created : {
        type:Date,
        default: Date.now
    },
    dateCompleted : {
        type:Date,
        default: Date.now
    }
});

module.exports.Todo = mongoose.model('Todo', TodoSchema);
module.exports.TodoList = mongoose.model('TodoList', TodoListSchema);
