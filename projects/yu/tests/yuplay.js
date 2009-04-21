/** YuPlay tests.
 *  with YUI.Test
 */
var defaultValuesCase = new YAHOO.tool.TestCase({
    name: "Default Values Tests",

    testVQValue: function () {
        var result = yuplay.parameters.vq;
        YAHOO.util.Assert.areEqual('', result);
    },

    testRacyValue: function () {
        var result = yuplay.parameters.racy;
        YAHOO.util.Assert.areEqual('include', result);
    },

    testViewCountValue: function () {
        var result = yuplay.parameters.orderby;
        YAHOO.util.Assert.areEqual('relevance', result);
    },

    testAltValue: function () {
        var result = yuplay.parameters.alt;
        YAHOO.util.Assert.areEqual('json-in-script', result);
    }
});
YAHOO.tool.TestRunner.add(defaultValuesCase);

var inputCase = new YAHOO.tool.TestCase({
    name: "Search Input Test",

    setUp: function () {
        yuplay.input.val('Test');
    },

    tearDown: function () {
        yuplay.input.val('');
    },

    testFetchSearchValue: function () {
        var result = yuplay.input.val();
        YAHOO.util.Assert.areEqual("Test", result);
    }
});
YAHOO.tool.TestRunner.add(inputCase);
/*
var restrictCase = new YAHOO.tool.TestCase({
    name: "Restrict input Test",

    testRestrictToggle: function () {
        $('#restrict').click();
        var result = yuplay.parameters.racy;
        YAHOO.util.Assert.areEqual("exclude", result);


        $('#restrict').click();
        result = yuplay.parameters.racy;
        YAHOO.util.Assert.areEqual("include", result);
    }
});
YAHOO.tool.TestRunner.add(restrictCase);
*/
var requestCase = new YAHOO.tool.TestCase({
    name: 'getting the request URL Test',

    setUp: function () {
        yuplay.parameters = {
            vq:      'test',
            racy:    'include',
            orderby: 'viewCount', // relevance, published, viewCount and rating
            alt:     'json-in-script' //atom, rss, json and json-in-script
        };
    },

    testGettingRequestWithParameters: function () {
        var compare = 'http://gdata.youtube.com/feeds/api/videos?vq=test'
                       + '&racy=include&orderby=viewCount&alt=json-in-script';
        var result = yuplay.get_request();
        YAHOO.util.Assert.areEqual(compare, result);
    }
});
YAHOO.tool.TestRunner.add(requestCase);


var getvideoidCase = new YAHOO.tool.TestCase({
    name: 'getting the video id from Watch URL Test',

    setUp: function () {
        this.url = '';
    },

    testGettingVideoId: function () {
        var url = "http://www.youtube.com/watch?v=ANTDkfkoBaI";
        var result = yuplay.get_video_id(url);
        var compare = 'ANTDkfkoBaI';
        YAHOO.util.Assert.areEqual(compare, result);
    },

    testFailingGettingVideoId: function () {
        var url = "http://www.youtube.com/watch?v=";
        var result = yuplay.get_video_id(url);
        console.log(result);
        var compare = '';
        YAHOO.util.Assert.areEqual(compare, result);
    }
});
YAHOO.tool.TestRunner.add(getvideoidCase);

// Test that the feed provided by YouTube stays the same!
var dataFeedCase = new YAHOO.tool.TestCase({
    name: 'Data Feed Test',

    setUp: function () {
        this.url = '';
    },

    testGettingVideoId: function () {
        var url = "http://www.youtube.com/watch?v=ANTDkfkoBaI";
        var result = yuplay.get_video_id(url);
        var compare = 'ANTDkfkoBaI';
        YAHOO.util.Assert.areEqual(compare, result);
    },

    testFailingGettingVideoId: function () {
        var url = "http://www.youtube.com/watch?v=";
        var result = yuplay.get_video_id(url);
        console.log(result);
        var compare = '';
        YAHOO.util.Assert.areEqual(compare, result);
    }
});
//YAHOO.tool.TestRunner.add(dataFeedCase);


var durationCase = new YAHOO.tool.TestCase({
    name: 'Video Duration Test',

    setUp: function () {
        this.duration_min = 231;
        this.duration_hour = 3610;
    },

    testGettingMinutes: function () {
        var result = yuplay.get_video_duration(this.duration_min);
        var compare = '';
        YAHOO.util.Assert.areEqual(compare, result);
    },

    testGettingHours: function () {
        var result = yuplay.get_video_duration(this.duration_hour);
        var compare = '';
        YAHOO.util.Assert.areEqual(compare, result);
    }
});
//YAHOO.tool.TestRunner.add(durationCase);

var timeoutCase = new YAHOO.tool.TestCase({
    name: 'Time Out Test',

    setUp: function () {
        this.duration_min = 231;
        this.duration_hour = 3610;
    },

    testTimeOutCallback: function () {
        var called = false;
        var tm = {
            time: 1000,
            callback: function () {
                called = true;
                console.info(called);
                YAHOO.util.Assert.areEqual(called, true);
            },
            name: 'test'
        };
        yuplay.time_out.start(tm);
    },

    testTimeOutClearing: function () {
        var called = false;
        var tm = {
            time: 2000,
            callback: function () {
                called = true;
                console.info(called);
                YAHOO.util.Assert.areEqual(called, true);
            },
            name: 'test'
        };
        yuplay.time_out.start(tm);
        yuplay.time_out.end(tm.name);
        YAHOO.util.Assert.areEqual(called, false);
    }
});
YAHOO.tool.TestRunner.add(timeoutCase);

$(function () {
    //create the logger
    var logger = new YAHOO.tool.TestLogger("testLogger");

    //run the tests
    YAHOO.tool.TestRunner.run();
});
