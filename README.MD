RESTful api supporting creation and management of TODO Lists.


1. Get ALL Todo Lists
    -GET http://localhost:8080/api/todolists

2. Create NEW Todo List
    -POST http://localhost:8080/api/todolists
        {title:'My New Todo List'}

3. Get Specific Todo List
    -GET http://localhost:8080/api/todolists/:todoList_id, i.e.
        > http://localhost:8080/api/todolists/5867ba74660bc4250bb20026

4. Delete Todo List
    -DELETE http://localhost:8080/api/todolists/:todoList_id, e.g.
        > http://localhost:8080/api/todolists/5867ba89660bc4250bb20027

5. Add Todo to TodoList
    -PUT http://localhost:8080/api/todolists/:todoList_id/add
        {description : 'number 1 todo task'}

6. Togggle isCompleted status for a given Todo
    - PUT http://localhost:8080/api/todolists/:todoList_Id/complete/todo_Id, i.e.
        > http://localhost:8080/api/todolists/5867ba74660bc4250bb20026/complete/5867bbdb660bc4250bb20028
7. Remove specific Todo from a given Todo List
    - PUT http://localhost:8080/api/todolists/:todoList_Id/remove/todo_Id, i.e.
        > http://localhost:8080/api/todolists/5867ba74660bc4250bb20026/remove/5867bbdb660bc4250bb20028

Notes
i. Be sure to perform POST/PUT with x-www-form-urlencoded.
