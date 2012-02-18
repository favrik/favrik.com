---
layout: post
title: Adding jQuery tabs dynamically, or what to do when there is no pre-existing HTML for the tabs
meta_description: A way or technique to add jQuery Tabs programmatically, only with javascript, without requiring the HTML being present
meta_keywords: jQuery, jQuery tabs, adding tabs dyamically, adding tags programmatically
category: [javascript]
---
<p class="update"><strong>UPDATE August 11, 2009:</strong> 
I realized this article had a major flaw: no working code!   So I wrote <a href="/2009/08/11/dynamically-adding-jquery-tabs-round2/">another article</a> and, in addition, you can go directly to the <a title="Demo of dynamic jQuery tabs" href="/examples/tabs/">demo</a>.
</p>

If you have worked with jQuery for some time, it is most likely that you already heard 
about jQuery tabs.  They are a neat solution to some information display problems (e.g., when you
are short on content space). They are pretty easy to install and customize 
(with the beautiful Theme Roller application). But what happens when you have to create the HTML code on the 
fly?  Meaning, there's no pre-existing HTML structure for you to attach the tabs.

I resolved this situation by doing the following (of course, there must be better ways but 
I couldn't find them at the internets):

Add HTML content dynamically to be able to add tabs programmatically:
{% highlight javascript %}
    var create_ui = function (tabs) {
        var dom = $.DIV({},
            $.H1({}, 'Whatever just for demonstration purposes', $.SPAN({}, 'version 1.0')),
            $.DIV({id: tabs}, '')
        );
        $('body').append(dom);  
    };
{% endhighlight %}

<p>Initialize the tabs, and then remove the dummy empty tab:</p>

{% highlight javascript %}
    var setup_tabs = function (tabs_id) {
        var dom = $.UL({},
            $.LI({}, 
                $.A({href:'#dummy'}, '')
            )
        );
        $(tabs_id).append(dom);

        // this boilerplate code that can be helpful, otherwise remove it
        $(tabs_id).tabs({
            select: function (event, ui) {
            },
            remove: function (event, ui) {
            },
            show: function (event, ui) {
                if (ui.panel) {
                    console.log(ui.panel.id);
                }
            }
        });

        // remove the dummy tab
        $(tabs_id).tabs('remove', 0);
    };
{% endhighlight %}

<p>And now you can add tabs programmatically:</p>

{% highlight javascript %}
    var tabs_id = '#my_tabs';
    var add_tab = function (id, name, data) {
        $(tabs_id).append(data).tabs('add', id, name);
    };
{% endhighlight %}

<p>I'm using the <a href="http://mg.to/2006/02/27/easy-dom-creation-for-jquery-and-prototype">jQuery DOM plugin</a> 
to create HTML quickly. Most of the time, this is <strong>not</strong> a good idea, specially, for complex
interfaces. Think about maintainability ;).</p>

<p>Happy hacking! =)</p>

