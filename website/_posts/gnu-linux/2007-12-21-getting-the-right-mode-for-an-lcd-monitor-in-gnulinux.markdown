--- 
wordpress_id: 41
layout: post
title: Getting the right mode for an LCD monitor (in GNU/Linux)
wordpress_url: http://blog.favrik.com/2007/12/21/getting-the-right-mode-for-an-lcd-monitor-in-gnulinux/
category: [linux]
---
Usually, setting a new <a href="http://debian.org">debian</a> box with <a href="http://fluxbox.org">fluxbox</a> as a desktop environment, is fast, easy, an uncomplicated (if you have done it 10 times already).  What I didn't know, was that using a widescreen LCD monitor would mess things with my usual setup.

The first problem you notice, is that the fonts look awful.  At first, I thought it was something to do with anti-aliasing, but changing resolutions with <code>xrandr</code> showed me the real problem.

After looking for about 1.5 hours without success, I decided to let it go for the day.  The next day, refreshed, I was able to assess the problem in a more calm way. <a href="http://ubuntuforums.org/showthread.php?t=237988">This post</a> was the starting point on the road to monitor resolution bliss.  Only problem was that all the links mentioned were not working. Information doesn't lie static for more than 1 year. So next step was to try pulling the results from google's cache. And <a href="http://72.14.205.104/search?q=cache:QlgTnyaR0GEJ:wiki.caoslinux.org/X_Server_Configuration+%22Getting+the+Right+Mode+for+an+LCD+monitor%22&hl=en&ct=clnk&cd=4&client=iceweasel-a">there it is</a>.

<h2>How to use the native resolution of your WideScreen Monitor in GNU/Linux</h2>
<ol>
	<li>Find the specifications of your monitor, and <a href="http://xtiming.sourceforge.net/cgi-bin/xtiming.pl">generate a Modeline string</a></li>
	<li>Backup your <code>xorg.conf</code> file and put something very similar to:</li>
<pre>
Section "Monitor"
    Identifier    "h193wk"
    Modeline      "1440x900_60.00"  106.47  1440 1520 1672 1904  900 901 904 932 -HSync +Vsync
EndSection

(...)

Section "Screen"
    Identifier    "Screen1"
    Device        "nvidia0"
    Monitor       "h193wk"
    Subsection "Display"
        Depth     24
        Modes     "1440x900_60.00"
        ViewPort  0 0
    EndSubsection
EndSection
</pre>
	<li>Enjoy!   (Obviously, you need the correct graphic driver already configured.  Mine is an NVidia card, so I used <a href="http://albertomilone.com/nvidia_scripts1.html">envy</a>)</li>
</ol>

