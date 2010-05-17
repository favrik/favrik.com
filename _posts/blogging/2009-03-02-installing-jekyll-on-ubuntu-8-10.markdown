--- 
layout: post
title: Installing Jekyll on Ubuntu 8.10
tags: [ jekyll, ruby ]
category: [blogging]
---
<a href="http://github.com/mojombo/jekyll/tree/master">Jekyll</a> is a simple, blog aware, static site generator. Probably because I don't know Ruby, it took me a considerable amount of time to set up, so I thought this could be useful for a person in a similar situation.

Assuming you don't even have Ruby:

{% highlight bash %}
$ sudo apt-get install ruby ruby1.8-dev rdoc1.8
{% endhighlight %}

<p>Install Python pygments for highlighting your source code:</p>

{% highlight bash %}
$ sudo apt-get install python-pygments
{% endhighlight %}


<p>For some reason, gem didn't install any of the dependencies for mojombo-jekyll, so I did it manually, but later found out that I needed to add the github repository:</p>

{% highlight bash %}
$ sudo gem sources -a http://gems.github.com

// now install Jekyll with dependencies auto-installed
$ sudo gem install mojombo-jekyll -s http://gems.github.com/
{% endhighlight %}

<p>I was migrating from Wordpress, so I had to do the following to convert my posts to Jekyll:</p>
{% highlight bash %}
$ sudo gem install sequel
$ sudo apt-get install libmysqlclient15-dev 
$ sudo gem install mysql
$ export DB=my_wordpress_db
$ export USER=dbuser
$ export PASS=dbpass
$ ruby -r '/usr/lib/ruby/gems/1.8/gems/mojombo-jekyll-0.4.1/lib/jekyll/converters/wordpress' -e 'Jekyll::WordPress.process( \
 "#{ENV["DB"]}", "#{ENV["USER"]}", "#{ENV["PASS"]}")'
{% endhighlight %}

<p>After all that package management, when I ran Jekyll for the first time, I got several error messages from Maruku. I went for the best option and installed the alternative: RDiscount.</p>

{% highlight bash %}
$ sudo gem install rdiscount
{% endhighlight %}

<p>Finally, I was able to view the generated site. After this oddisey I needed a rest, so I shutted down the computer and went to sleep.</p>

<p>Next, you will want the "Related posts" feature. I advice you to install the following (and save some headaches):</p>

{% highlight bash %}
// You could also add these packages to the initial apt-get install
$ sudo apt-get install gsl-bin libgsl0-dev
{% endhighlight %}

<p>Then, you need to install the Ruby GSL package from <a href="http://rb-gsl.rubyforge.org/">http://rb-gsl.rubyforge.org/</a>. Extract the rb-gsl-xxx.tar.gz file and:</p>

{% highlight bash %}
$ cd rb-gsl-xxx/
$ ruby setup.rb config
$ ruby setup.rb setup
$ sudo ruby setup.rb install
{% endhighlight %}

<p>However, apparently the classifier gem has a bug, a quick google search produced:
<a href="http://rubyforge.org/tracker/index.php?func=detail&aid=17839&group_id=655&atid=2587">Patch for `build_reduced_matrix': uninitialized constant Classifier::LSI::Matrix (NameError)</a>
but I opted for a slighly different code:</p>
{% highlight ruby %}
if $GSL
  u * GSL::Matrix.diag( s ) * v.trans
else 
  u * Matrix.diag( s ) * v.trans
end
{% endhighlight %}

<p>Now, when you run Jekyll with the --lsi switch, it is like 100x faster. (I might be exagerating.)
</p>

<p>If you want a go at styling the pygmentized code, you can get a base style by executing:</p>

{% highlight bash %}
$ pygmentize -f html -S colorful -a .highlight > syntax.css
{% endhighlight %}
<p>Finally, this is how I run Jekyll:</p>
{% highlight bash %}
// For writing/developing
$ jekyll --pygments --rdiscount

// For previewing the site (but I prefer to setup an apache vhost)
$ jekyll --pygments --rdiscount --server

// Final site generation
$ jekyll --lsi --pygments --rdiscount
{% endhighlight %}

