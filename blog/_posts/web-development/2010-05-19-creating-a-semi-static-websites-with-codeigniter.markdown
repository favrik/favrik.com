---
layout: post
title: Creating a semi-static website with CodeIgniter
meta_description: How to create semi-static website with CodeIgniter to achieve template reuse and save time.
meta_keywords: CodeIgniter, static websites, websites, web-development, 
category: ['web-development']
---
<p class="update"><strong>UPDATE <del>28 February 2011</del> 6 June 2011:</strong> 
There's actually <del>a better</del> another way to do this!, I've created a post as a follow-up for this one. Please check it out if you want to save some typing. ;)
<a href="http://blog.favrik.com/2011/06/06/creating-a-semi-static-website-with-codeigniter-round-2/">Creating a semi-static website with Codeigniter ROUND 2!</a>
</p>

Next time, when faced with the task of creating a static website (a rare occurrence these days), try using your favorite framework to take advantage of template re-use.  On this post, I will show you how to achieve that using an existing setup for CodeIgniter, so a basic understanding of the framework is required.

## Requirements
1. The git program to perform a clone
1. Basic understanding of how CodeIgniter works
1. I assume you are using a linux or similar Operating system, but this can be done on Windows too (some commands don't exist there though)
1. Patience ^_^


## The setup
First, let's grab a base application by cloning a git repository, and then removing the `.git` folder to start &#8220;fresh&#8221;:
{% highlight bash %}
$ git clone http://github.com/favrik/codeigniter_project_skeleton.git MyStaticSite
$ cd MyStaticSite
$ rm -fr .git
{% endhighlight %}
This assumes your website will reside in a directory named MyStaticSite, so I'll use that name from now on. 

### Important note
For this to work, your web server has to be configured to have `MyStaticSite/public` as the web root directory.  However, if you are on shared hosting, you usually have a `public_html` directory as the web root. If so, just put the contents of the `public` directory inside the `public_html` directory.

The advantage of using the provided files is that it saves you time (hopefully) by providing a default configuration.  You definitely can use your custom setup, but I'm using a base controller (MY_Controller) with custom methods and conventions that allow me to create static sites easily. In your custom setup, you would need this controller or at least adapt some of its functionality to your own base controller.

After these steps, your website directory will have the following structure:
{% highlight bash %}
$ cd MyStaticSite
$ tree -d
{% endhighlight %}
<div class="terminal">
    <pre>
    .
    |-- application
    |   |-- config
    |   |-- controllers
    |   |-- errors
    |   |-- helpers
    |   |-- hooks
    |   |-- language
    |   |   `-- english
    |   |-- libraries
    |   |-- models
    |   `-- views
    |-- codeigniter
    `-- public
    </pre>
</div>
Where you can see that the `application` directory mirrors the standard CodeIgniter application directory.

Next step is to either upload or symlink the CodeIgniter's `system` directory inside `MyStaticSite/codeigniter` directory. 
{% highlight bash %}
$ cd MyStaticSite/codeigniter
$ ln -s /my/path/to/CodeIgniter_1.7.2/system/ system
{% endhighlight %}

Now, when you try to access the website you will get the default controller index action view, which is blank.


## Customizing the website layout
This is when things start to get interesting. The reason we are doing all of this, is to re-use templates by having a master layout used by all the pages in the website. This way, when you need to change the layout (adding Google analytics, changing the header logo, etc.) you only do it once.

You can find the layout at `MyStaticSite/application/views/layout.php`. The starting layout is very, very basic, but now you can start adding the global parts of your website to the layout.  These are commonly the header (with all the required CSS, and Javascript files), perhaps a sidebar or two, the footer, any widget, etc.

## Adding web pages
To add a static webpage you have to perform three steps. It could seem like a lot but in reality you do the first and second steps in bulk, and then focus on your views which are the most important part for a static website.

### First, create a controller action
{% highlight php %}
<?php

class Defaulted extends MY_Controller {
    
    // This would be used for the usual About page, obviously. :)
    public function about() {
        // The value passed to the render method is used for the Page title
        $this->render('About');
    }
}

{% endhighlight %}

### Second, add a custom route
Edit the `MyStaticSite/application/config/routes.php` file and add the following line:
{% highlight php %}
<?php
//...omitting the lines of code above

/* About page */
$route['about'] = 'defaulted/about';
{% endhighlight %}




### Third, add the corresponding view
The convention used by the base controller is to follow a view directory structure using the name of the controller for the directory, and the name of the action for the view file name. For this example, this would be the file layout:

<div class="terminal">
    <pre>
    |-- application
        |-- controllers
        |   `-- defaulted.php
        `-- views
            |-- defaulted
            |   `-- about.php
            `-- layout.php
    </pre>
</div>


Finally, you can access your page by going to http://example.com/about .  Was that easy? ^_^  Feel free to post any questions/problems/etc.

