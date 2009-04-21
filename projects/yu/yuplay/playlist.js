(function () {
    var global = this;

    /** Class: yuplay_playlist
     *  YuPlay playlist widget.
     */
    global.yuplay_playlist = function (options) {
        /** PrivateVariables: yuplay_playlist variables
         *
         *  container - jQuery DOM Element that contains the playlist.
         *  playlist - jQuery DOM Element for the playlist widget
         *  toggle - 
         *  items - Array holding the video items that will be called when 
         *    player becomes ready.
         */
        var container = options.container,
            playlist = options.playlist,
            toggle    = false,
            items     = [];

        playlist.click(function (e) {
            console.info($(e.target).get(0).id);
        });

        /** PrivateFunction: in_list
         *  Check if an item is inside the playlist.
         *
         *  This is just a helper function.
         *
         *  Parameters:
         *      (String) needle - The item we are searching for.
         *      (Array) haystack - The search array.
         *
         *  Returns:
         *      true if needle is inside the haystack, false otherwise.
         */
        var in_list = function (needle, haystack) {
            var result = false;
            for (var i = 0; i < haystack.length; i++) {
                if (needle == haystack[i].url) {
                    result = true;
                    break;
                }
            }
            return result;
        };

        /** PrivateFunction: _add
         *  Add an item to the playlist.
         *
         *  Parameters:
         *      (Integer) video - The video information object.
         */
        var _add = function (video) {
            if (items.length == 0) {
                // Doing this because we initialize the playlist with an Action message
                playlist.empty();
                container.show();
            }
            if (!in_list(video.url, items)) {
                var class_li = toggle ? {className:'alter'} : {};
                class_li.id = 'pl' + items.length;
                toggle = !toggle;
                items.push(video);
                var dom = $.LI(class_li, video.title);
                playlist.append(dom);
            }
        };

        /** PrivateFunction: _remove
         *  Handles.
         *
         *  Parameters:
         *      (Integer) state - The player state (playing, buffering, etc.).
         */
        var _remove = function (video_id) {
            for (var i = 0; i < items.length; i++) {
                if (items[i] == video_id) {
                    items.splice(i, 1);
                }
            }
            $('#' + video_id).remove();
        };

        // Public instance methods
        return {
            add: function (video) {
                _add(video);
            },

            remove: function (video_id) {
                _remove(video_id);
            },

            get: function (position) { 
                if (items[position] != undefined) { 
                    return items[position];
                }
                return false;
            },

            show: function () { 
                container.show();
            },

            clear:  function () { 
                items = [];
                playlist.empty();
            },

            length: function () {
                return items.length;
            }
        };
    };

})();
