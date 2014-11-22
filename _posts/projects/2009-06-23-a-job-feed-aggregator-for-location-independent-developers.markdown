---
layout: post
title: A Job Feed Aggregator for Location Independent Developers
meta_description: Jobs with location set to Anywhere
meta_keywords: jobs, freelance jobs, freelancing, developer, freelance developer
category: [projects]
---

<a href="http://favrik.com/projects/jobs/">This is just me scratching an itch</a>. It attempts to make filtering jobs/gigs a lot faster.
An interesting note:  while I'm currently not interested in jobs that require working on-site, one could learn about the market trends by looking at them. 
By market trends I mean: new technologies, new languages, new methodologies, etc.; which may not be interesting until you see a job offer asking for them (or you see them mentioned 
at <a href="http://www.reddit.com/r/programming/">reddit</a> or <a href="http://news.ycombinator.com/">hacker news</a>).

This was (or maybe it still is) a fun quick project where I reached at some personal conclusions about the RSS parsing scene in PHP: 

* Apparently, parsing XML was very hard in PHP4
* There are not a lot of <a href="http://stackoverflow.com/questions/250679/best-way-to-parse-rss-atom-feeds-with-php">RSS parsers in PHP</a>
* I needed to filter specific items from the feeds, and did not find a way to do this (perhaps I didn't look that well)

Therefore, I created a custom toy parser that enabled filtering and formatting support. So now you will only see job offers that are location independent, or in other words, their location is set to "Anywhere".  I'm currently grabbing
the feeds from oDesk, Authentic Jobs, and Freelance Switch.  I don't know if other interesting feeds are out there, so let me know.

Thanks to javascript, you can filter the results, or job items in a "live search" way.  Also, the app keeps track of viewed items, and feed preferences. So head to the <a href="http://favrik.com/projects/jobs/">Jobs page</a>, and enjoy.
