--- 
wordpress_id: 3
layout: post
title: Visual Editors?
wordpress_url: http://blog.favrik/?p=3
category: [javascript]
---
<strong class="question">Do you want an embedded WYSIWYG editor for your web applications?</strong>

<strong class="big">NO!!!</strong> Just let me input &mdash;pure&mdash; HTML. Thank you very much.  

Unfortunately, yourself is not the only client you are going to have...erm, hopefully.   <strong>So what are your guidelines for dealing with this matter?</strong>  Assuming your development process is almost bulletproof, the reason to include a Visual Editor like this one:
<img src="/images/re.jpg" title="TinyMCE in WordPress" alt="TinyMCE in WordPress" />
should be backed up by a need to solve a crucial problem.  And what you want is probably a modified "light" version of an existing solution.
<ul>
	<li>Browser compatibility.  It was going beautifully, until I used Opera. If it doesn't work in all major browsers look for another solution, or implement it yourself. </li>
	<li>If you have a basic editor, turn the rich editor off by default.</li>
	<li>Clean markup output.</li>
	<li>Provides the usual feeling of standard rich editors (i.e. MS Word).</li>
	<li>If you go with it, please do make extensive testing.</li>
</ul>

Without having much experience, it is hard for me to imagine a reason why somebody would need (in all the extent of the word definition) a rich editor.  <em>Avoid at all costs</em> should be the immediate response.  If you succeed in doing this, a feeling of happiness, and tranquility will be your reward.

Good luck!
