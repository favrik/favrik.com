---
layout: post
title: Rails 3 Unobtrusive Javascript not working with jQuery!
meta_description: Rails 3 UJS not working with jQuery
meta_keywords: rails 3, ujs, ujs jquery, rails 3 remote true
category: [ruby]
---
So you started switching to Rails 3 and found out that the <code>:remote => true</code> option is, 
 strangely, not working with your <a href="https://github.com/rails/jquery-ujs">jQuery UJS adapter</a>?   

<strong>Make sure you are using jQuery version >= 1.4.3</strong>

<blockquote>
HTML 5 data- Attributes

As of jQuery 1.4.3 HTML 5 data- attributes will be automatically pulled in to jQuery's data object.
</blockquote>
