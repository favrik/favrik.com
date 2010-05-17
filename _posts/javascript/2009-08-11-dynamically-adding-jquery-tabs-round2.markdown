---
layout: post
title: 'Dynamically adding jQuery tabs: round 2'
meta_description: how to dynamically add or create jquery tabs 
meta_keywords: jQuery, jquery tabs, tabs, javascript, dynamically add tabs, jquery create tab dynamically, jquery tabs programmatically
category: [javascript]
---
In my <a title="My previous post about adding jQuery tabs dynamically" href="http://blog.favrik.com/2009/04/26/adding-jquery-tabs-dynamically,-or-what-to-do-when-there-is-no-pre-existing-html-for-the-tabs/">previous related post</a>, I did not provide working code. I thought I was. 

I also was giving the example using jQuery DOM, therefore adding an unneeded dependency, which is never good.

With this post, I'm trying to fix that.  Here's a real <a href="/examples/tabs/" title="Demo of dynamically adding jQuery tabs">quick demo</a> where you can see the usage. So without further ado here's the working code (hopefully in all browsers XD)

{% highlight javascript %}

var dyna_tabs = {
    
    tabs: null,

    init: function (id) {
        var tabs = $('<div></div>').append('<div id="'+ id + '"></div>');
        $('body').append(tabs);

        var list = $('<ul></ul').append('<li><a href="#"></a></li>');
        tabs.append(list);

        tabs.tabs();

        // remove the dummy tab
        tabs.tabs('remove', 0);
        tabs.hide();

        this.tabs = tabs;
    },

    add: function (tab_id, tab_name, tab_content) {
        if (this.tabs != null) {
            if (this.tabs.css('display') == 'none') {
                this.tabs.show();
            }
            var data = $('<div id="'+tab_id+'"></div>').append(tab_content);
            this.tabs.append(data).tabs('add', '#' + tab_id, tab_name);
            this.tabs.tabs('select', '#' + tab_id);
        } else {
            alert('Tabs not initialized!');
        }
    }

};

{% endhighlight %}

<strong>Note:</strong> obviously, this code is just for demonstration purposes. The final implementation depends on what you are trying to do.  Enjoy! ^_^
