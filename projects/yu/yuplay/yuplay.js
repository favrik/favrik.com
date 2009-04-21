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
    DATA_FEED:      'http://gdata.youtube.com/feeds/api/videos',
    VERSION:        '0.1',
    COLUMNS:        4,
    SEARCH_TIMEOUT: 10000,
    MAX_RESULTS:    25,
   
    /** PrivateVariable: search_index
     *  Current results page. Used for pagination.
     */
    search_index: 1,

    /** Function: init
     *  Initialize the application.
     *
     *  Creates the widgets, sets the app parameters, and attach the events
     *  for searching.
     *
     *  Parameters: 
     *      (Object) options - Options object to be extended.
     */
    init: function (options) {
        // Set default options
        var options = $.extend({
            descriptions: false
        }, options || {});

        // Show descriptions?
        yuplay.use_descriptions = options.descriptions;

        // Attach data sources
        yuplay.input = options.input;

        // Attach containers
        yuplay.results_container = options.results_container;

        // Setup Utilities
        yuplay.loading_animation = yuplay_app_messages(options.app_messages);
        yuplay.time_out = time_out();

        // Create play list
        yuplay.playlist = yuplay_playlist({
            playlist:  options.playlist,
            container: options.playlist_container
        });

        // Create player
        yuplay.player = yuplay_player({
            yp_id:     options.player_id,
            playlist:  yuplay.playlist,
            container: $('#player'),
            buttons:   options.player_buttons
        });

        // setup Flash chromeless player
        swfobject.embedSWF(
            "http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer",
            "ytapiplayer", options.player_width, options.player_height, "8", 
            null, null, { allowScriptAccess: "always", allowFullScreen: "true", bgcolor: "#000000" },
            { id: options.player_id }
        );

        // And finally, setup some events
        yuplay.attach_events(options);
    },

    attach_events: function (options) {
        options.form.submit(yuplay.search);
        options.restrict.click(yuplay.restrict_toggle);
        options.clear_button.click(function () {
            yuplay.playlist.clear();
            options.results_container.find('span').empty();
        });

        yuplay.results_container.click(function (e) {
            var data  = null,
                added = null,
                type;

            type = e.target.nodeName.toLowerCase();
            if (type == 'a') {
                data = $(e.target).data('yv');
            }
            if (type == 'img') {
                data = $(e.target.parentNode.parentNode).find('a').data('yv');
            }

            if (data != null) {
                data = $.secureEvalJSON(data);
                yuplay.playlist.add(data);
                added = $(e.target.parentNode.parentNode).find('span');
                $(added).empty();
                $(added).append('Added!');
            }
            
            return false;
        });

        /*
        $(window).resize(function () {
            yuplay.compute_width();
        });
        yuplay.compute_width();
        */
    },

    /** Function: compute_width
     *  Compute the results container width to display the maximum columns possible.
     */
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
        if (query == '') {
            query = 'Nothing';
        }
        //yuplay.input.val('');
        //yuplay.parameters.vq = query == '' ? yuplay.parameters.vq : query;
        yuplay.loading_animation.show('Searching ...');
        yuplay.append_script_tag(
            yuplay.get_request(query), 'search_results', 'yuplay.search_callback'
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
    get_request: function (query) {
        var url = '?',
            request,
            params = null;

        params = yuplay.parameters(query); // FIXME Double passing, but at least it encapsulates
        for (var param in params) {
            url += param + '=' + params[param] + '&';
        }
        url = url.substring(0, url.length - 1);

        request = yuplay.DATA_FEED + url + '&max-results=' + yuplay.MAX_RESULTS
                  + '&start-index=' + yuplay.search_index;
        console.info('API request URL: ' + request);
        return request;
    },

    /** Variable: parameters
     *  Data Feed URL parameters.
     */
    parameters: function (query) {
        return {
            q:          query,
            safeSearch: 'none',
            orderby:    'relevance', // relevance, published, viewCount and rating
            alt:        'json-in-script', //atom, rss, json and json-in-script
            strict:     'true',
            v:          '2'
        };
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
        var list = null,
            dom  = null;

        yuplay.time_out.end('search');
        yuplay.loading_animation.finish();

        if (data.feed.entry) {
            console.log(data.feed);
            yuplay.search_index = parseInt(data.feed.openSearch$startIndex.$t);
            console.log('Results page #: ' + yuplay.search_index);

            dom = $.DIV({}, 
                list = $.UL({className: 'clearfix'}, 
                    yuplay.paginator(data.feed.openSearch$totalResults.$t),
                (function () {
                    var dom       = [],
                        iteration = 0;
                    for (var i = 0, c = data.feed.entry.length; i < c; i++) {
                        var entry = data.feed.entry[i];
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

            $(list).append(
                yuplay.paginator(data.feed.openSearch$totalResults.$t)
            );
            yuplay.playlist.show();
        } else {
            dom = $.DIV({}, $.H2({}, 'No results found'));
        }

        yuplay.results_container.empty();
        yuplay.results_container.append(dom);
    },

    paginator: function (total_results) {
        // Do we even have to paginate?
        if (parseInt(total_results) <= yuplay.MAX_RESULTS) {
            return;
        }

        var next,
            prev,
            prev_index,
            next_index,
            dom;

        dom = $.LI({className: 'paginator clearfix'},
            prev = $.INPUT({type: 'button', className: 'prev', 
                            value: '<< Previous'}),
            next = $.INPUT({type: 'button', className: 'next', 
                            value: 'Next >>'})
        );

        prev_index = yuplay.search_index - yuplay.MAX_RESULTS;
        next_index = yuplay.search_index + yuplay.MAX_RESULTS;

        if (prev_index < 1) {
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
	    			entry.media$group.media$player.url
			    ),
            url:            entry.media$group.media$player.url,
            duration:       yuplay.get_video_duration(
                                entry.media$group.media$content[0].duration
                            ),
            title:          entry.media$group.media$title.$t,
            image:          entry.media$group.media$thumbnail[0].url,
            description:    entry.media$group.media$description.$t
        };

        /*
        if (entry.yt$statistics) {
            item.view_count     = entry.yt$statistics.viewCount;
            item.favorite_count = entry.yt$statistics.favoriteCount;
        }
        */
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
        var link, 
            title, 
            dom,
            item = yuplay.setup_video_data(entry);
        
        dom = $.LI({}, 
            $.DIV({className: 'thumb'}, 
                link = $.IMG({src: item.image, alt: item.title})

            ),
            $.P({className: 'info'},
                item.duration,
                $.SPAN({}, '')  // to display the status "Added!"
            ),
            $.H3({}, 
                title = $.A({href: item.url}, item.title)
            )
        );

        if (yuplay.use_descriptions) {
            $(dom).append($.P({style:{'display': 'none'}}, item.description));
        }
        $(title).data('yv', $.compactJSON(item));

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
        $('#yuplay').find(':input').removeAttr('disabled');
        $('#search').val('');
        yuplay.input.focus();
        yuplay.player.start();
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
}


/** Load Application **/
$(function () {

    // Configuration
    var options = {
        form:               $('#yuplay'),
        input:              $('#search'),
        restrict:           $('#restrict'),
        results_container:  $('#results'),
        playlist:           $('#play_list'),
        playlist_container: $('#play_list_container'),
        clear_button:       $('#clear_b'),
        app_messages: {
            container: $('#status')
        },
        descriptions:  true,
        player_height: '266.25',
        player_width:  '355',
        player_id:     'yt_player',
        player_buttons: {
            play:  $('#play_b'),
            pause: '',
            stop:  $('#ystop'),
            next:  $('#ynext'),
            prev:  $('#yprev'),
            full:  $('#yfull'),
            pref:  $('#ypref')
        }
    };

    // Initialization
    yuplay.init(options);

    // App is started when the YT player is ready, See above.

})
