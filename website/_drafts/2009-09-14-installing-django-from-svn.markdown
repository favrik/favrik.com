---
layout: post
title: Installing Django from SVN on Ubuntu 9.04
meta_description: 
meta_keywords: 
---
This document is __not__ geared to first time users. If you are a first time user, please go here: [How to install Django](http://docs.djangoproject.com/en/dev/topics/install/).

h2. Setup Django code

Install from SVN:
{% highlight text %}
svn co http://code.djangoproject.com/svn/django/trunk
cd trunk
sudo python setup.py install
{% endhighlight %}

Find where are your SITE_PACKAGES:
{% highlight text %}
python -c "from distutils.sysconfig import get_python_lib; print get_python_lib()"
{% endhighlight %}


Link Django with your SITE_PACKAGES:
{% highlight text %}
cd trunk
sudo ln -s `pwd`django /usr/lib/python2.6/dist-packages/django
{% endhighlight %}


h2. Database setup 

I picked MySQL for this iteration so I need [MySQLdb](http://sourceforge.net/projects/mysql-python). It's as easy as doing:
{% highlight text %}
python setup.py build
sudo python setup.py install
{% endhighlight %}

h2. Apache link (mod_wsgi) and test project

sudo apt-get install libapache2-mod-wsgi
sudo gvim /etc/apache2/mods-available/wsgi.conf

Add the following line to wsgi.conf:

WSGIScriptAlias /django /home/favio/web/django/django.wsgi

This means you will access your app by going to http://localhost/django

Now actually create the .wsgi file:

mkdir -p /home/favio/web/django
{% highlight python %}
import os
import sys
sys.path.append('/home/favio/web/django/mysite')

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
{% endhighlight %}

Create the sample project:

cd /home/favio/web/django
django-admin.py startproject mysite


Test!

Go to http://localhost/django







