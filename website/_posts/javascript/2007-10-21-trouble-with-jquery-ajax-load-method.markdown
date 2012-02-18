--- 
wordpress_id: 21
layout: post
title: Trouble with jQuery Ajax load() method
wordpress_url: http://blog.favrik.com/2007/10/21/trouble-with-jquery-ajax-load-method/
category: [javascript]
---
<p class="update"><strong>UPDATE 4 March 2009</strong> This may not be what you are looking for!  My problem at that time, was me using a duplicate element Id. Element Ids must be unique. So, most likely, it has nothing to do with your AJAX problems. I hope this saves you some time.</p>

When you do a search on google with the title of this post as the keywords expecting to get some light on a problem you have been banging your head for some hours; it is most likely you won't find a solution.  The first reason is that <a href="http://jquery.com">jQuery</a> does rock, and the second is that the <a href="http://docs.jquery.com/Ajax/load#urldatacallback">documentation for the load() method</a> is very clear. So I'm writing this to make a stop in time and try not to forget this small observation.

As part of a <a href="http://blog.favrik.com/2007/08/15/a-study-of-php-frameworks/">side project</a> of mine, I'm coding a small app with <a href="http://codeigniter.com">CI</a> as the php framework and jQuery as the js one. Problem is: I've been trying to Ajax load some content without success for some time.


<h2>The Problem</h2>
I can't load the following content:
{% highlight html %}
<form action="<?php echo base_url(); ?>ranges/edit"  id="addRangeForm" method="post">
        <fieldset>
          <label for="name">Name:</label>
          <input type="text" name="name" id="name" value="<?php echo $this->validation->name;?>" />
          <label for="display">Display Name:</label>
          <textarea name="display_name"  id="display" rows="1" cols="20"><?php echo $this->validation->display_name;?></textarea>
          <label for="description">Description:</label>
          <input type="hidden" name="id" value="" />
          <textarea name="description" id="description" rows="5" cols="20"></textarea>
          <p>
            <button type="submit" class="forms">Save Range</button><a class="hidinglink" id="hideForm" href="<?php echo base_url(); ?>">Remove form</a>
          </p>
          <p class="clear"></p>
        </fieldset>
      </form>
{% endhighlight %}

<a href="http://www.getfirebug.com/">Firebug</a> says the request is being done, it shows the response on the console, but not on the browser window.  After switching to $.get, loading in other containers (only when loading into the whole document object, the form was displayed), and trying static content. I finally managed to find why it wasn't showing.

<h2>The Solution</h2>
Remove the opening form tag!  This one:
{% highlight html %}
<form action="<?php echo base_url(); ?>ranges/edit"  id="addRangeForm" method="post">
{% endhighlight %}
And we got us some nice content load. 

<strong>After investigating the issue further</strong>, the reason of this behavior was that the id of the form that I wanted to load, was already being used!  So the solution really is:
<h3>Id's must be unique through the whole document.</h3>

<h2>Conclusion</h2>
Fun times. (>_<)
