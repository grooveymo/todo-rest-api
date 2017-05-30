// =============================================================================
// import required packages
// =============================================================================
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');

//declare name of db
var db = 'todolist-db';

// =============================================================================
// configure app
// =============================================================================
// log requests to the console
app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set our port
//var port = process.env.PORT || 8080;
var port = process.env.PORT || 9090;

// connect to our database
mongoose.connect('mongodb://localhost/' + db);

//declare mongo models
var Todo  = require('./app/models/todolist').Todo;
var TodoList  = require('./app/models/todolist').TodoList;


// =============================================================================
// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('request received');

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); //enable react-todo app to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');// enable angular2-todo app to connect
	
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'Welcome to TodoList api!'});
});


// on routes that end in /todolist
// ----------------------------------------------------
// CREATE a NEW Todo List
router.route('/todolists')
    // create a todolist (accessed at POST http://localhost:8080/api/todolists)
    .post(function (req, res) {
        var todoList = new TodoList();		// create a new instance of the TodoList model
        todoList.title = req.body.title;  // set the Todo List Title (comes from the request)
        todoList.save(function (err) {
            if (err)
                return res.send(err);

            res.json({message: 'TodoList created!', todoList: todoList});
        });


    })
// RETRIEVE ALL Todo Lists
    // get all the TodoLists (accessed at GET http://localhost:8080/api/todolists)
    .get(function (req, res) {
        TodoList.find(function (err, todoLists) {
            if (err)
                return res.send(err);

            res.json(todoLists);
        });
    });


// on routes that end in /todolists/:todolist_id
// ----------------------------------------------------
// get specific TodoList (accessed at GET http://localhost:8080/api/todolists/<todoList_id>)
router.route('/todolists/:todoList_id')
    // get the bear with that id
    .get(function (req, res) {
        TodoList.findById(req.params.todoList_id, function (err, todoList) {
            if (err)
                return res.send(err);
            res.json(todoList);
        });
    })
// delete the TodoList with this id
    .delete(function (req, res) {
        console.log('deleting ', req.params.todoList_id);

        TodoList.remove({
            _id: req.params.todoList_id
        }, function (err, todoList) {
            if (err)
                return res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    });

// on routes that end in /todolists/:todolist_id/add
// ----------------------------------------------------
// add Todo to a specific TodoList (accessed at PUT http://localhost:8080/api/todolists/<todoList_id>/add)
router.route('/todolists/:todoList_id/add')
    .put(function (req, res) {

        TodoList.findById(req.params.todoList_id, function (err, todoList) {
            if (err)
                return res.send(err);

            var todo = new Todo();		// create a new instance of the Todo model
            todo.description = req.body.description;  // set the Todo description (comes from the request)
            todoList.todos.push(todo);

            todoList.save(function (err, todoList){
                if(err)
                    console.log('Problem saving todo task to todoList : '+ err.message);

                res.send(todoList);
            });

        });
    });

// on routes that end in /todolists/:todolist_id/remove/:todoId
// ----------------------------------------------------
// delete Todo from specific TodoList (accessed at DELETE http://localhost:8080/api/todolists/<todoList_id>/remove/<todoId>)
router.route('/todolists/:todoList_id/remove/:todoId')
    .delete(function (req, res) {

        TodoList.findById(req.params.todoList_id, function (err, todoList) {
            if (err)
                return res.send(err);

            todoList.todos.id(req.params.todoId).remove();

            todoList.save(function(err, updatedTodoList){
                if(err)
                    console.log('Problem deleting todo task from todoList : '+ err.message);

                res.send(updatedTodoList);

            });
        });
    });

// on routes that end in /todolists/:todolist_id/complete/:todoId
// ----------------------------------------------------
// Toggles Todo status from specific TodoList (accessed at PUT http://localhost:8080/api/todolists/<todoList_id>/complete/<todoId>)
router.route('/todolists/:todoList_id/complete/:todoId')
    .put(function (req, res) {

        TodoList.findById(req.params.todoList_id, function (err, todoList) {
            if (err)
                return res.send(err);

            var todo = todoList.todos.find(function(element){
                return element.id === req.params.todoId;
            });

            todo.isCompleted = !todo.isCompleted;
            if(todo.isCompleted){
                todo.completed = new Date();
            }
            else {
                todo.completed = null;
            }

            todoList.save(function(err, updatedTodoList){
                if(err)
                    console.log('Problem toggling complete field for todo task from todoList : '+ err.message);

                res.send(updatedTodoList);

            });
        });
    });


// =============================================================================
// REGISTER OUR ROUTES
// =============================================================================
app.use('/api', router);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('REST API deployed on port ' + port);
