"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var store_1 = require('./services/store');
var TodoComponent = (function () {
    function TodoComponent(todoStore) {
        this.newTodoText = '';
        this.todoStore = todoStore;
    }
    TodoComponent.prototype.stopEditing = function (todo, editedTitle) {
        todo.title = editedTitle;
        todo.editing = false;
    };
    TodoComponent.prototype.cancelEditingTodo = function (todo) {
        todo.editing = false;
    };
    TodoComponent.prototype.updateEditingTodo = function (todo, editedTitle) {
        editedTitle = editedTitle.trim();
        todo.editing = false;
        if (editedTitle.length === 0) {
            return this.todoStore.remove(todo);
        }
        todo.title = editedTitle;
    };
    TodoComponent.prototype.editTodo = function (todo) {
        todo.editing = true;
    };
    TodoComponent.prototype.removeCompleted = function () {
        this.todoStore.removeCompleted();
    };
    TodoComponent.prototype.toggleCompletion = function (todo) {
        this.todoStore.toggleCompletion(todo);
    };
    TodoComponent.prototype.remove = function (todo) {
        this.todoStore.remove(todo);
    };
    TodoComponent.prototype.addTodo = function () {
        if (this.newTodoText.trim().length) {
            this.todoStore.add(this.newTodoText);
            this.newTodoText = '';
        }
    };
    TodoComponent = __decorate([
        core_1.Component({
            selector: 'todo-app',
            templateUrl: 'app/todo.component.html',
            providers: [store_1.TodoStore]
        }), 
        __metadata('design:paramtypes', [store_1.TodoStore])
    ], TodoComponent);
    return TodoComponent;
}());
exports.TodoComponent = TodoComponent;
//# sourceMappingURL=todo.component.js.map