/** Function: on_state_change
 *  Called on each Youtube Flash Player update.
 *
 *  Parameters: 
 *      (Integer) state - The state code of the player, the state can be
 *        playing, buffering, paused, etc.
 */
function on_state_change(state) {
    yuplay.player.update(state);
}

/** Function: on_error
 *  Called when there is an error on the Youtube player.
 *
 *  Parameters:
 *      error - Error code.
 */
function on_error(error) {
    console.error(error); 
}

(function () {
    var global = this;

    /** Class: yuplay_player
     *  Youtube video player widget.
     */
    global.yuplay_player = function (options) {
        /** PrivateVariables: yuplay_player variables
         *
         *  yp - Youtube Player id.
         *  container - DOM Element that contains the player.
         *  play_list - A reference to the play_list widget.
         *  current - The current video that is playing/paused on the player.
         *  callbacks - Array holding the funtions that will be called when 
         *    player becomes ready.
         */
        var yp                  = options.yp_id,
            container           = options.container,
            playlist            = options.playlist,
            current             = null,
            on_ready_callbacks  = [], // they will be called when the player becomes ready!
            State = {
                ENDED:      0, // STOPPED
                READY:     -1, // or unstarted
                BUFFERING:  3, // Sometimes it says playing, while it's really buffering
                PLAYING:    1,
                PAUSED:     2,
                QUEUED:     5
            },
            Register = {
               STOPPED: false,
               INTERRUPTED: false
            };

        var attach_events = (function (buttons) {
            // Setup Play Button event
            buttons.play.click(function () {
                on_ready_callbacks.push(function () {
                    controls.play_all();
                });
            });

            buttons.stop.click(function () {
                controls.stop();
            });

            buttons.next.click(function () {
                controls.next();
            });

            buttons.prev.click(function () {
                controls.prev();
            });
        
            buttons.full.click(function () {
                yp.setSize(400, 300);
            });

         })(options.buttons);

        /** PrivateFunction: setup
         *  Setups the player.
         *
         *  Initializes the Youtube Player object, and adds the StateChange
         *    event.
         */
        var setup = function () {
            yp = document.getElementById(yp);
            yp.addEventListener("onStateChange", "on_state_change");
            yp.addEventListener("onError", "on_error");
        };

        /** PrivateFunction: status_quo
         *  Handles the state of the player.
         *
         *  For now, this function 1) controls the continuous play portion of 
         *  the player. And 2) calls the registered callbacks when the player
         *  becomes ready.
         *
         *  Parameters:
         *      (Integer) state - The player state (playing, buffering, etc.).
         */
        var status_quo = function (state) {
            log_state(state);

            if (state == State.ENDED 
                && !Register.INTERRUPT && !Register.STOPPED) { // ENDED
                controls.next(); 
            }

            if (state == State.READY) { // READY, but really unstarted
                for (var i = 0; i < on_ready_callbacks.length; i++) {
                    on_ready_callbacks[i]();
                }
                setup_new_play_all_click();
            }

            if (state == State.PLAYING) {
                Register.INTERRUPT = false;
            }
        };

        var log_state = function (state) {
            for (var st in State) {
                if (State[st] == state) {
                    console.info('Player state: ' + state + ' ' + st);
                }
            }
        }

        /** PrivateFunction: setup_new_play_all_click
         *  Hacked-up function to replace the Play button click event.
         *
         *  This has to be done because there's a delay between the document 
         *  being ready, and the Youtube Flash Player becoming ready. So the 
         *  first time you click the Play button, it doesn't try to play the
         *  video immediatly, but when the player is ready.
         */
        var setup_new_play_all_click = function () {
            var button = $('#play_b');
            button.unbind('click');
            button.click(function () {
                controls.play_all();
            });
        };

        /** PrivateClass: controls
         *  Player controls logic inside.
         */
        var controls = {
            play: function (video) {
                console.log('playing: '+ current + ' ' + video.id);
                if (yp) {
                    yp.loadVideoById(video.id, 0);
                    yp.playVideo();
                }
            },

            play_all: function () {
                if (playlist.length() > 0) {
                    current = 0;
                    yp.unMute();
                    yp.setVolume(100);
                    controls.play(playlist.get(current));
                }
            },

            next: function () {
                // Have we arrived at the last video in the list?
                if (playlist.length() == (current + 1)) {
                    yp.clearVideo();

                    return;
                }
                current++;
                yp.clearVideo();
                Register.INTERRUPT = true;
                controls.play(playlist.get(current));
                console.log('next: ' + current + ' ' + playlist.get(current).id);
            },

            prev: function () {
                // Let's do a cyclic player
                current--;
                if (current < 0) {
                    current = 0;
                }
                Register.INTERRUPT = true;
                controls.play(playlist.get(current));
                console.log('prev: ' + current + ' ' + playlist.get(current).id);
            },

            stop: function () {
                Register.STOPPED = true;
                yp.stopVideo();
                yp.clearVideo();
            },

            pause: function () {
                yp.pauseVideo();
            }
        };

        return {
            start: function () {
                setup(); 
            },

            play: function (video_id) {
                controls.play(video_id); 
            },

            play_all: function () {
                controls.play_all(); 
            },
            
            next: function () {
                controls.next(); 
            },

            stop: function () { 
                controls.stop(); 
            },

            pause: function () {
                controls.pause();
            },

            call_on_ready: function (func) {
                on_ready_callbacks.push(func); 
            },

            update: function (state) {
                status_quo(state); 
            }
        }
    };

})();
