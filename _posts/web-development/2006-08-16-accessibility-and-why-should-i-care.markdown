--- 
wordpress_id: 6
layout: post
title: Accessibility and why should I care
wordpress_url: http://blog.favrik/?p=6
category: ['web-development']
---
I decided to make this site accessible.   <a href="http://diveintoaccessibility.org/">Wonderful resource</a> for this matter.  In the beginning I said: "I don't care if not everybody can read my website".  So selfish, and incomprehensive. You have to put yourself in the shoes of others to understand.  Of course, for most people it would be safer not to encounter this site. (^_^) But this is great as an exercise. I clearly see myself using accessibility in the near future. o.o"
<h2><a href="http://www.alistapart.com/stories/doctype/">Doctype</a></h2>
WP uses XHTML 1.0 Transitional.
<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&gt;
</code>
<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"   "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"&gt;
</code>
<h2><a href="http://www.loc.gov/standards/iso639-2/englangn.html">Language</a></h2>
I mostly use english (en), and spanish (es).
<code>
For XHTML 1.0 Strict
&lt;html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en"&gt;
</code>

<code>
For XHTML 1.1
&lt;html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"&gt;
</code>
<h2>Meaningful page titles.</h2>
WP accomplishes this fine.
<h2>Providing additional navigation aids.</h2>
In WordPress this is implemented by a plugin.  From the ones listed at the <a href="http://wordpress.org/support/topic/39661?replies=9">WP forum</a>, and the <a href="http://trac.wordpress.org/ticket/1523">trac ticket</a>; the most appealing to me is <a href="http://wordpress.org/support/topic/39661?replies=9">META Relationship Links</a>. You can <a href="http://guff.szub.net/downloads/meta-relationship-links.zip">dowload it</a>.
<h2>Presenting your main content first.</h2>
Hehe, with CSS, this is truly easy!! And since my navigation div is using absolute positioning: no worries!

To be continued...
