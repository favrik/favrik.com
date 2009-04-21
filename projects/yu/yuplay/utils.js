(function () {

    var global = this;

    /** Class: time_out
     *  Utility class to setup timeouts.
     */ 
    global.time_out = function () {
    
        /** Variable: callers
         *  Used to hold the timeout ids to be able to clear them later 
         *  if necessary.
         */
        var callers = {};

        return {
            /** Function: start
             *  Start a timeout.
             *
             *  Parameters: 
             *      (Object) options - Options object to be extended.
             */
            start: function (options) {
                var options = $.extend({
                    name: 'cute_timeout',
                    time: 1000,
                    callback: function () { alert('time out finished!'); }
                }, options || {});

                var timeout_id = window.setTimeout(function () {
                    options.callback();
                }, options.time);
                callers[options.name] = timeout_id;
            },

            /** Function: end
             *  Terminate a Timeout.
             *
             *  Parameters: 
             *      (String) name - The name that was used for registering a timeout.
             */
            end: function (name) {
                window.clearTimeout(callers[name]);
            }
        };
    };


    /** Status Messages Widget **/
    global.yuplay_app_messages = function (options) {
        var container = options.container;

        /** PrivateFunction: change_text
         *
         *  Parameters:
         *      (String) text - The new text of the message container.
         */
        var change_text = function (text) {
            container.find('p').empty();
            container.find('p').append(text);
        };

        return {
            show: function (text) {
                change_text(text);
                container.show();
                container.find('img').show();
            },

            finish: function (text) { 
                //replace_text(text); 
                //icon.hide(); 
                container.hide();
            },

            message: function (text) {
                change_text(text);
                container.show();
                container.find('img').hide();
            },

            hide:    function ()     { 
                container.hide(); 
            },

            update:  function (text) {
                change_text(text); 
            }
        };
    };

})();
