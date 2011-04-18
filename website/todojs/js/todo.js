// Assume we have jQuery
//

var TodoModel = function () {
        this.storage = []
    },

    TodoAddView = function () {
        this.controller = null;
    },

    TodoController = function () {
    };


TodoModel.prototype = {

    add: function (item) {
        item = $.trim(item);

        this.storage.push(item);

        $.publish('/todo/itemAdded', [ item ]);
    },

    remove: function (index) {
        this.storage.splice(index, 1);

        $.publish('/todo/itemRemoved', [ index ]);
    }

};

TodoAddView.prototype = {

    setController: function (controller) {
        this.controller = controller;
    },

    init: function () {
        if (this.controller !== null) {
            this.addEventListeners();
            this.subscribe();
        }
    },

    addEventListeners: function () {
        var context = this;

        $('#addTodoForm').submit(function (e) {
            e.preventDefault();

            context.controller.addTodo(context.getData());
        });

        $('#todoList').click(function (e) {
            e.preventDefault();

            var elm = $(e.target);

            if (elm.is('a')) {
                context.controller.removeTodo(elm.parent().index());
            }

        });
    },

    getData: function () {
        return $('#todo').val();
    },

    subscribe: function () {
        $.subscribe('/todo/itemAdded', function (item) {
            var tpl = '<li><a href="#remove-todo">[X]</a> %s</li>';

            $('#todoList ul').append(tpl.replace(/%s/g, item));
            $('#todo').val('');
        });

        $.subscribe('/todo/itemRemoved', function (itemId) {
            $('#todoList li').eq(itemId).remove();
        });
    }

};

TodoController.prototype = {

    run: function (options) {
        this.model = options.model;
        this.view = options.view;

        this.view.setController(this);
        this.view.init();
    },

    addTodo: function (todo) {
        this.model.add(todo);
    },

    removeTodo: function (index) {
        this.model.remove(index);
    }
};



// Run the app
//


(function ($) {


    $(function () {
        
        var controller = new TodoController,
            model      = new TodoModel,
            view       = new TodoAddView;

        controller.run({
            'model': model, 
            'view': view
        });

    });



})(jQuery);
