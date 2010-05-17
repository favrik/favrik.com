--- 
wordpress_id: 26
layout: post
title: "WordPress Plugin: Recent Posts grouped by year, month, and day"
wordpress_url: http://blog.favrik.com/2007/10/26/wordpress-plugin-recent-posts-grouped-by-date/
category: [php]
---
Since a simple list of the recent blog posts looks really boring (ok, maybe the content is the origin of boredom), I wanted to group those posts by year, month and day.

The nearest match to what I wanted was <a href="http://www.ardamis.com/2007/06/25/adding-the-post-date-to-wp_get_archives/">A plugin for adding the post date to wp_get_archives</a>.  I based my plugin on Oliver Baty's plugin. Thanks for putting up the code to download, it was really helpful. (^_^)

However, before the coding started, there was a need to conduct a more aggressive search; just in case there was already a Plugin that did the same thing I wished.  

<!--more-->

The result was negative. It is understandable, since this kind of Plugin affects the presentation layer. Finding a "recent posts" plugin that fits everybody is impossible. Mental note: if I ever get to program a big complex WP Plugin, I'll go with the functional side, instead of the behavioral or presentational one; would be cool to follow <a href="http://lorelle.wordpress.com/2007/02/06/a-love-letter-to-wordpress-plugin-authors/">this guide</a> too.

<h2>Plugin source and documentation</h2>
<a href="http://blog.favrik.com/examples/favrik-recent-posts.txt">Download the source</a>.  It's open. ;)
{% highlight php %}
<?php
/*
Plugin Name: favrik Recent Posts 
Plugin URI: http://blog.favrik.com/
Description: Display recent posts by date: 1) grouping by year, month,day, and 2) just the date at the left side of the title. Based on the work by <a href="http://www.ardamis.com">Oliver Baty</a>. <a href=" http://www.ardamis.com/2007/06/25/adding-the-post-date-to-wp_get_archives/">Details are here</a>.
Version: 0.1
Author: Favio Manriquez
Author URI: http://blog.favrik.com

    Copyright 2007  Favio Manriquez  (email : favio@favrik.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

/**
 Most important configuration variable is $group:
 0      -       Just put the date at the left side.
 1      -       Group by year, month, and day.
*/
function favrik_recent_posts($args = '') {
	global $wp_locale, $wpdb;

    // params fun
    parse_str($args, $r);
    $defaults = array('group' => '1', 'limit' => '10', 'before' => '<li>', 'after' => '</li>', 'show_post_count' => false, 'show_post_date' => true, 'date' => 'F jS, Y', 'order_by' => 'post_date DESC');
	$r = array_merge($defaults, $r);
	extract($r);
    
    // output 
    $output    = '';
    $pre       = '';
    $full_date = '';
    $year      = '';
    $month     = '';
    $day       = '';
    
	// the query
	$where = apply_filters('getarchives_where', "WHERE post_type = 'post' AND post_status = 'publish'");
	$join  = apply_filters('getarchives_join', "");
    $qry   = "SELECT ID, post_date, post_title, post_name 
              FROM $wpdb->posts $join 
              $where ORDER BY $order_by LIMIT $limit";
	$arcresults = $wpdb->get_results($qry);
	if ($arcresults) {
		foreach ($arcresults as $arcresult) {
			if ($arcresult->post_date != '0000-00-00 00:00:00') {
				$url  = get_permalink($arcresult);
				if ($group == 0) { // dates at the side of the post link
                    $arc_date = date($date, strtotime($arcresult->post_date));
                    $full_date = '<em class="date">' . $arc_date . '</em> ';
                }
                if ($group == 1) { // grouping by year then month-day
                    $y = date('Y', strtotime($arcresult->post_date));
                    if ($year != $y)  {
                        $year = $y;
                        $pre = '<li class="year">' . $year . '</li>';
                    }
                    $m = date('F Y', strtotime($arcresult->post_date));
                    if ($month != $m) {
                        $month = $m;
                        $pre .= '<li class="month">' . substr($month, 0, -4) . '</li>';
                    } 
                    $d = date('jS', strtotime($arcresult->post_date));
                    if ($day != $d) {
                        $day = $d;
                        $full_date = '<em>' . $day . '</em>';
                    }
                }
                $text = strip_tags(apply_filters('the_title', $arcresult->post_title));
				$output .= get_archives_link($url, $text, $format, 
                                              $pre . $before . $full_date, 
                                             $after);
                $pre = ''; $full_date = '';
			}
		}
    }
    echo $output;
}
?>
{% endhighlight %}
<h3>How to use it</h3>
Upload to your server and activate the plugin at WordPress admin interface. And try these variations in a template:
{% highlight php %}
<ul id="recent-posts">
 <?php favrik_recent_posts('group=1&limit=5'); ?>
</ul>

<ul id="recent-posts">
 <?php favrik_recent_posts('group=0&limit=5'); ?>
</ul>
{% endhighlight %}
The <em>limit </em>parameter tells how many posts to display at max.  The <em>group </em>parameter sets how the  post are going to be displayed:
 0      -       Just put the date at the left side.
 1      -       Group by year, month, and day.

<h2>What now?</h2>
I can imagine several ways of customizing a recent posts list.  Fortunately, it's an easy task when you have so many code snippets available.  Gg.
