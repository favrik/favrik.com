--- 
wordpress_id: 22
layout: post
title: jQuery.slideDown flicker when a form is inside the sliding container
wordpress_url: http://blog.favrik.com/2007/10/22/jqueryslidedown-flicker-when-a-form-is-inside-the-sliding-container/
category: [javascript]
---
I prefer long and clear post titles. (^_^)

Having invested more than 8 hours in trying to solve this little problem and, as usual, when I was just going to give up and go with no animation, I came to the realization that I was focusing the first input element of the form right after calling slideDown().  

So, I removed that code, checked the <a href="http://docs.jquery.com/Effects/slideDown#speedcallback">documentation</a> and, ta-da!, problem fixed.

<h2>Dang</h2>
The not-so-cool thing is that I tried a lot of things to make that error go away. Like: removing styles, removing scripts, removing element by element, using javascript calls in links instead of using unobstrusive js, watching tv, playing basketball, using a super basic html file and then adding each component one by one, etc. (a big etc., by the way)

Now, the sad thing is that the animation is not behaving very well on IE7 (works on Opera 9, IE6, FF, Safari for windows).

<h2>Wisdom bit</h2>
The interesting point here, is learning to think under pressure. The main error was in front of my nose during that precious time.  In conclusion, learning to position your head correctly so that the next errors are in front of your eyes, could be a pretty good damn investment.
