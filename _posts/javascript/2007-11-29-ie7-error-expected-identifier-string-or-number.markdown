--- 
wordpress_id: 36
layout: post
title: "IE7 Error: Expected identifier, string or number"
wordpress_url: http://blog.favrik.com/2007/11/29/ie7-error-expected-identifier-string-or-number/
category: [javascript]
---
<p class="update"><strong>UPDATE 4 March 2009:</strong> I have added useful information, instead of just the link to the solution.</p>

The cause, reason, or explanation for this issue is: an extra comma in a Javascript Object declaration.

For example:
{% highlight javascript %}
var Test = {
    hello: function () {
        alert('hello');
    },

    bye: function () {
        alert('bye');
    },
};
{% endhighlight %}
You should notice that after the bye() function, there is a comma that, to be strict, is not really needed. 

Most browsers are ok with that extra comma. However, on Internet Explorer browsers (at least on IE6, and IE7), this extra comma can break an application completely. So, by code convention, you must never
leave extra commas, after declaring object methods/functions. That is, unless you don't want to support IE. 

Here's a link with a different explanation: <a href="http://www.avnetlabs.com/javascript/expected-identifier-string-or-number-say-what">Expected identifier, string, or ... say what?</a> .
