/** File: yuplay.js
 *  YuPlay: search Youtube videos and create playlists from them.
 *  
 *  Yuplay is a javascript application where you can search Youtube videos,
 *  create playlists, and play them.  It uses the script tag technique to 
 *  hava AJAX-like behavior so it should be fast.  This is just a pet project.
 */

/** Code yanked from the Yahoo media player. Thanks, Yahoo.
 * 
 *  Adds dummy functions for browsers that don't support the console/firebug
 *  objects.
 */
if (! ("console" in window) || !("firebug" in console)) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", 
                 "dirxml", "group", "groupEnd", "time", "timeEnd", "count",
                 "trace", "profile", "profileEnd"];
    window.console = {};
    for (var i = 0; i <names.length; ++i) {
        window.console[names[i]] = function() {};
    }
}

(function () {
    var global = this;

    /** Status Messages Widget **/
    global.yuplay_app_messages = function (options) {
        var container = options.container;

        /** PrivateFunction: status_quo
         *  Handles the state of the player.
         *
         *  For now, this function 1) controls the continuos play portion of 
         *  the player. And 2) calls the registered callbacks when the player
         *  becomes ready.
         *
         *  Parameters:
         *      (Integer) state - The player state (playing, buffering, etc.).
         */
        var replace_text = function (text) {
            container.find('p').empty();
            container.find('p').append(text);
        };

        return {
            show: function (text) {
                replace_text(text);
                container.show();
                container.find('img').show();
            },

            finish: function (text) { 
                //replace_text(text); 
                //icon.hide(); 
                container.hide();
            },

            message: function (text) {
                replace_text(text);
                container.show();
                container.find('img').hide();
            },

            hide:    function ()     { 
                container.hide(); 
            },

            update:  function (text) {
                replace_text(text); 
            }
        };
    };

})();

/** Class: yuplay
 *  YuPlay application controller.
 *
 *  The application is started by calling the *init* method.  It holds the
 *  player, and playlist widgets to attach the search event when necessary.
 *  This class is focused on searching videos, processing the search results,
 *  and attaching behavior to each result item.
 */
var yuplay = {
    /** PrivateConstants: configuration constants
     *  Run-time configuration constants.
     *
     *  DATA_FEED - The data feed url from Youtube.
     *  VERSION - Application version for reference.
     *  COLUMNS - The number columns used to display the search results.
     *  SEARCH_TIMEOUT - The number of miliseconds before timing out a search.
     *  MAX_RESULTS - Max search results to retrieve.
     */
    DATA_FEED: 'http://gdata.youtube.com/feeds/api/videos',
    VERSION: '0.1',
    COLUMNS: 4,
    SEARCH_TIMEOUT: 10000,
    MAX_RESULTS: 25,

    /** Constructor: init
     *  Initialize the application.
     *
     *  Creates the widgets, sets the app parameters, and attach the events
     *  for searching.
     *
     *  Parameters: 
     *      (Object) options - Options object to be extended.
     */
    init: function (options) {
        var options = $.extend({
            descriptions: false
        }, options || {});

        // Set flag options
        yuplay.use_descriptions = options.descriptions;

        // Attach data sources
        yuplay.input = options.input;

        // Attach containers
        yuplay.results_container = options.results;

        // Create play list
        yuplay.play_list = yuplay_play_list({
            play_list: options.play_list,
            container: options.play_list_container
        });

        // Create app messages
        yuplay.loading_animation = yuplay_app_messages(options.app_messages);

        // Setup events
        options.form.submit(yuplay.search);
        options.restrict.click(yuplay.restrict_toggle);
        options.clear_button.click(function () {
            yuplay.play_list.clear();
            options.results.find('span').empty();
        });
        /*
        $(window).resize(function () {
            yuplay.compute_width();
        });
        yuplay.compute_width();
        */
        yuplay.search_index = 1; // Init search page
    },

    compute_width: function () {
        var to_ems = function (px) {
            return (px * .0625);
        };
        
        var video   = to_ems($('#video_playlist').width()),
            thumb   = 9.375, // default video thumbnail width
            win     = to_ems($(window).width()),
            pad     = 1.25, // default body margin
            surface = win - (pad * 3) - video;

        //console.info('win: ' + win  + ' video: ' + video);
        yuplay.COLUMNS = parseInt(surface/thumb);
        //console.info('Times: ' + yuplay.COLUMNS);
        // Fix widths for wrapper and search_videos column
        $('#search_videos').width((yuplay.COLUMNS * thumb) + 'em');
        $('#wrapper').width( ((yuplay.COLUMNS * thumb) + pad + video) + 'em' );
        //console.info(' wrap: ' + to_ems($('#wrapper').width()) + ' list: ' + to_ems($('#search_videos').width()));
        $('#results').find('li.breaker').remove();
        //console.info('Columns: ' + yuplay.COLUMNS);
        var elms = $('#results').find('li');
        for (var i = 0; i < elms.length; i++) {
            if ($(elms[i]).hasClass('paginator')) {
                continue;
            }
            if (i % yuplay.COLUMNS == 0) {
                //console.info(i);
                $(elms[i]).after($.LI({className:'breaker'}));
            }
        }
    },

    /** Function: search
     *  Handles the search event.
     *
     *  Parses the input search, dispays a progress-like animation, sets a 
     *  search timeout, and applies the script tag hack to retrieve the search
     *  results.
     */
    search: function () {
        var query = yuplay.input.val();
        if (query == '' && yuplay.parameters.vq == '') {
            yuplay.input.val('Nothing');
            yuplay.search();
            return false;
        }
        yuplay.input.val('');
        yuplay.parameters.vq = query == '' ? yuplay.parameters.vq : query;
        yuplay.loading_animation.show('Searching ...');
        yuplay.append_script_tag(
            yuplay.get_request(), 'search_results', 'yuplay.search_callback'
        );
        yuplay.time_out.start(yuplay.search_timeout());

        return false;
    },

    /** Function: get_request
     *  Constructs the URL used to call the Youtube Data Feed API.
     *
     *  Returns: 
     *      The Data Feed URL with the parameters added as a query string.
     */
    get_request: function () {
        var url = '?',
            request;

        for (var param in yuplay.parameters) {
            url += param + '=' + yuplay.parameters[param] + '&';
        }
        url = url.substring(0, url.length - 1);

        request = yuplay.DATA_FEED + url + '&max-results=' + yuplay.MAX_RESULTS
                  + '&start-index=' + yuplay.search_index;
        console.log(request);
        return request;
    },

    /** Variable: parameters
     *  Data Feed URL parameters.
     */
    parameters: {
        vq:      '',
        racy:    'include',
        orderby: 'relevance', // relevance, published, viewCount and rating
        alt:     'json-in-script' //atom, rss, json and json-in-script
    },

    /** Function: search_timeout
     *  Search timeout options.
     *  
     *  Returns:
     *      (Object) options - The search timeout options for the time_out 
     *        function. 
     */
    search_timeout: function () {
        return {
            name: 'search',
            time: yuplay.SEARCH_TIMEOUT,
            callback: function () {
                var link;
                var dom = $.SPAN({},
                    'You might have some network problems...',
                    link = $.A({href: '#', style: {'color': '#00f'}}, 
		              'Try Again?')
                );
                $(link).click(function () { yuplay.search(); });
                yuplay.loading_animation.update(dom);
            }
        };
    },

    /** Function: search_callback
     *  Process the search results.
     *  
     *  This is called by when the data feed request to youtube returns the
     *  result list. It adds events to each result item, and shows the player
     *  widget.
     */
    search_callback: function (data) {
        if (data.feed) {
            yuplay.results_container.empty();
            console.log(data.feed);
            yuplay.search_index = parseInt(data.feed.openSearch$startIndex.$t);
            console.log(yuplay.search_index);
            yuplay.time_out.end('search');
            yuplay.loading_animation.finish();
            var list;
            var dom = $.DIV({}, 
                list = $.UL({className: 'clearfix'}, 
                    yuplay.paginator(data.feed.openSearch$totalResults.$t),
                (function () {
                    var dom       = [],
                        iteration = 0;
                    for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
                        if (! entry.yt$noembed) {
                            entry.iteration = iteration;
                            dom.push(yuplay.add_video_result(entry));
                            if ((entry.iteration + 1) % yuplay.COLUMNS == 0) {
                                dom.push($.LI({className: 'breaker'}));
                            }
                            iteration++;
                        }
                    }

                    return dom;
                })()
            ));
            $(list).find('.thumb').mouseover(function (e) {
                var over = $(e.target);
            });
            $(list).find('.thumb').mouseout(function (e) {
                var over = $(e.target);
            });
            $(list).append(
                yuplay.paginator(data.feed.openSearch$totalResults.$t)
            );

            yuplay.results_container.empty();
            yuplay.results_container.append(dom);
            yuplay.play_list.show();
        }
    },

    paginator: function (total_results) {
        var next,
            prev,
            prev_index,
            next_index;

        // Do we even have to paginate?
        if (parseInt(total_results) <= yuplay.MAX_RESULTS) {
            return;
        }

        var dom = $.LI({className: 'paginator clearfix'},
            prev = $.INPUT({type: 'button', className: 'prev', 
                            value: '<< Previous'}),
                   $.H2({}, 'Search results for: ', $.SPAN({}, yuplay.parameters.vq)),
            next = $.INPUT({type: 'button', className: 'next', 
                            value: 'Next >>'})
        );

        prev_index = yuplay.search_index - yuplay.MAX_RESULTS;
        next_index = yuplay.search_index + yuplay.MAX_RESULTS;

        if (prev_index < 1) {
            //$(prev).addClass('disabled_input');
            $(prev).remove();
        } else {
            $(prev).click(function () {
                yuplay.search_index -= yuplay.MAX_RESULTS;
                yuplay.search();
            });
        }

        $(next).click(function () {
            yuplay.search_index += yuplay.MAX_RESULTS;
            yuplay.search();
        });

        return dom;
    },

    /** Function: get_video_duration
     *  Return the video duration in a nice format for display.
     *
     *  Parameters: 
     *      (Integer) duration - Video duration in miliseconds.
     *
     *  Returns:
     *      The video duration as a string to be displayed on the UI.
     */
    get_video_duration: function (duration) {
        var minutes = parseInt(duration / 60),
            seconds = duration % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    },

    /** Function: get_video_id
     *  Returns the video id part from a youtube video URL.
     *
     *  Parameters: 
     *      (String) url - A Youtube video ULR. 
     *         Example: From http://www.youtube.com/watch?v=aYHi9_Tm3v8
     *         it will return *aYHi9_Tm3v8*.
     */
    get_video_id: function (url) {
        var id = url.split('?v=', 2);
        return id[1];
    },

    /** Function: setup_video_data
     *  Constructs an object holding the video information from a data feed 
     *  item.
     *
     *  Parameters: 
     *      (Object) entry - A Youtube Data Feed entry.
     *
     *  Returns:
     *      The video item object with only the selected information.
     */
    setup_video_data: function (entry) {
        var item = {
            id:             yuplay.get_video_id(
	    			entry.media$group.media$player[0].url
			    ),
            url:            entry.id.$t,
            view:           entry.media$group.media$player[0].url,
            duration:       yuplay.get_video_duration(
                                entry.media$group.media$content[0].duration
                            ),
            title:          entry.media$group.media$title.$t,
            image:          entry.media$group.media$thumbnail[0].url,
            description:    entry.media$group.media$description.$t
        };

        if (entry.yt$statistics) {
            item.view_count     = entry.yt$statistics.viewCount;
            item.favorite_count = entry.yt$statistics.favoriteCount;
        }

        return item;
    },

    /** Function: add_video_result
     *  Creates a DOM element to hold a video item.
     *
     *  This is a greedy method, it does too much: creates the DOM elements 
     *  needed for a video item, and then adds the UI click events to each.
     *
     *  Parameters: 
     *      (Object) entry - A video entry.
     *
     *  Returns:
     *      A DOM element.
     */
    add_video_result: function (entry) {
        var link, added, title, dom,
            item    = yuplay.setup_video_data(entry);
        
        //if ((entry.iteration + 1) % yuplay.COLUMNS == 0) {
        //    dom = $.LI({className: 'extreme_right'});
        //} else {
        dom = $.LI({});
        //}

        $(dom).append(
            $.DIV({className: 'thumb'}, 
                link = $.IMG({src: item.image, alt: item.title})

            ),
            $.P({className: 'info'},
                item.duration,
                added = $.SPAN({}, '')
            ),
            $.H3({}, 
                title = $.A({href: item.view}, item.title)
            )
        );

        if (yuplay.use_descriptions) {
            $(dom).append($.P({style:{'display': 'none'}}, item.description));
        }

        var video_click_event = function (e) {
            yuplay.play_list.add(item);
            $(added).empty();
            $(added).append('Added!');
        };

        $(link).click(function (e) {
            video_click_event();
        });
        
        $(title).click(function (e) {
            video_click_event();
            return false;
        });

        return dom;
    },

    /** Function: restrict_toggle
     *  Set the parameter to define wether we are going to restrict search 
     *  results, or not.
     *
     *  Parameters: 
     *      (Object) setting - The click event object from the checkbox.
     */
    restrict_toggle: function (setting) {
        var checkbox = '#' + setting.target.id;
        yuplay.parameters.racy = $(checkbox).is(':checked') 
                                 ? 'include' : 'exclude';
    },

    /** Function: append_script_tag
     *  Creates a script tag for retrieving a Google data JSON feed and and
     *  adds it into the html head.
     *
     *  Function taken from the Youtube Sample code located at:
     *  http://gdata.ops.demo.googlepages.com/video_browser.html
     *
     *  Parameters:
     *      (String) scriptSrc  - The URL for the script, assumed to already 
     *        have at least one query parameter, so the '?' is not added to 
     *        the URL.
     *      (String) scriptId - The id to use for the script tag added to the 
     *        head.
     *      (String) scriptCallback - The callback function to be used after 
     *        the JSON is retrieved.  The JSON is passed as the first argument
     *        to the callback function.
     */
    append_script_tag: function (scriptSrc, scriptId, scriptCallback) {
        // Remove any old existance of a script tag by the same name
        var oldScriptTag = document.getElementById(scriptId);
        if (oldScriptTag) {
            oldScriptTag.parentNode.removeChild(oldScriptTag);
        }
        // Create new script tag
        var script = document.createElement('script');
        script.setAttribute('src', 
            scriptSrc + '&callback=' + scriptCallback);
        script.setAttribute('id', scriptId);
        script.setAttribute('type', 'text/javascript');
        // Append the script tag to the head to retrieve a JSON feed of videos
        // NOTE: This requires that a head tag already exists in the DOM at the
        // time this function is executed.
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    start: function () {
        console.log('wtf');
        $('#yuplay').find(':input').removeAttr('disabled');
        $('#search').val('');
        yuplay.input.focus();
    }
};

/** Class: yuplay.time_out
 *  Utility class to setup timeouts.
 */
yuplay.time_out = {
    
    /** Variable: callers
     *  Used to hold the timeout ids to be able to clear them later 
     *  if necessary.
     */
    callers: {},

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
        yuplay.time_out.callers[options.name] = timeout_id;
    },

    /** Function: end
     *  Terminate a Timeout.
     *
     *  Parameters: 
     *      (String) name - The name that was used for registering a timeout.
     */
    end: function (name) {
        window.clearTimeout(yuplay.time_out.callers[name]);
    }
};

/** Function: onYouTubePlayerReady
 *  Called when the Youtube Flash Player has been loaded.
 *
 *  Parameters: 
 *      (String) playerId - The flash player id in the HTML code.
 */
function onYouTubePlayerReady(playerId) {
    yuplay.start();
    yuplay.player.start();
}

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

/** Load Application **/
$(function () {
    var options = {
        form:                $('#yuplay'),
        input:               $('#search'),
        restrict:            $('#restrict'),
        results:             $('#results'),
        play_list:           $('#play_list'),
        play_list_container: $('#play_list_container'),
        clear_button:        $('#clear_b'),
        app_messages: {
            container: $('#status')
        },
        descriptions: true
    };
    yuplay.init(options);

    // allowScriptAccess must be set to allow the Javascript from one 
    // domain to access the swf on the youtube domain
    var params = { allowScriptAccess: "always", bgcolor: "#000000" };
    // this sets the id of the object or embed tag to 'myytplayer'.
    // You then use this id to access the swf and make calls to the player's API
    var atts = { id: "yt_player" };
    swfobject.embedSWF("http://www.youtube.com/apiplayer"
                       + "?enablejsapi=1&playerapiid=ytplayer", 
                       "ytapiplayer", "355", "266.25", "8", null, null,
                       params, atts);
    yuplay.player = yuplay_player({
        yp_id:     atts.id,
        play_list: yuplay.play_list,
        container: $('#player'),
        buttons:   { 
            play:  $('#play_b'),
            pause: '',
            stop:  '',
            next:  '',
            prev:  ''
        }
    });
});
