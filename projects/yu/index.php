<?php
require_once 'config.inc.php';

if (isset($_GET['tests']) and $_GET['tests'] == 1) {
    $testing = true;
    $test_text = 'Hide';
} else {
    $testing = false;
    $test_text = 'Show';
}
?>
<!DOCTYPE html 
     PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<link rel="stylesheet" type="text/css" href="<?php echo $cssUri; ?>" />
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>YuPlay: search YouTube videos, create playlists, and play!</title>
<?php if ($testing): ?>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/logger/assets/logger.css" />
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/yuitest/assets/testlogger.css" />
<?php endif; ?>
</head>
<body>
<div id="wrapper" class="clearfix">
    <div id="controller">
        <a href="/projects/yu/">Home</a> &nbsp;&nbsp; | &nbsp;&nbsp;
        <a href="/projects/yu/?tests=<?php echo (int) !$testing; ?>"><?php echo $test_text; ?> Javascript Tests</a> &nbsp;&nbsp; | &nbsp;&nbsp;
        <a href="/projects/yu/tests/yuplay.php">PHP Tests</a> &nbsp;&nbsp;  &nbsp;&nbsp;
    </div>
    <div id="intro" class="clearfix">
        <h1><a href="<?php echo $wp; ?>">YuPlay</a></h1>
        <div id="form">
        <p><strong>Search</strong> YouTube videos, create playlists, and play!</p>
        <form id="yuplay" action="">
            <fieldset>
                <input type="text" id="search" value="" disabled="disabled" name="search" size="40" />
                <input type="submit" value="Go"  />
            </fieldset>
        </form>
        </div>
    </div>
    <div id="video_playlist">
        <div id="player">
            <div id="ytapiplayer">&nbsp;</div>
        </div>
        <div class="player_controls" class="clearfix">
            <button id="yplay">Play</button>
            <button id="yprev">Prev</button>
            <button id="ynext">Next</button>
            <button id="ystop">Stop</button>
            <button id="yfull">Full</button>
            <button id="ylist">List</button>
            <button id="ypref">Pref</button>
        </div>
        <div id="play_list_container">
            <h2>Playlist</h2>
            <ol id="play_list"><li>Add videos by clicking on them!</li></ol>
            <div id="play_list_controls">
                <button id="clear_b">Clear</button> &nbsp; &nbsp; &nbsp; &nbsp;
                <button id="play_b">Play!</button>
            </div>
        </div>
    </div>
    <div id="search_videos">

        <div id="status" class="clearfix">
            <img id="loading_image" src="loading.gif" alt="Working" />
            <p>W o r k i n g ...</p>
        </div>
        <div id="results"></div>
    </div>
</div>
<noscript>
    <p>I'm very sorry to not support browsers without javascript. :'(</p>
</noscript>
<?php if ($testing): ?>
    <script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/yahoo-dom-event/yahoo-dom-event.js"></script>
    <script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/logger/logger-min.js"></script>
    <script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/yuitest/yuitest-min.js"></script>
<?php endif; ?>
<script type="text/javascript" src="<?php echo $jsUri; ?>"></script>
<?php if ($testing): ?>
    <script type="text/javascript" src="<?php echo autoVer('/projects/yu/tests/yuplay.js'); ?>"></script>
<?php endif; ?>
</body>
</html>
