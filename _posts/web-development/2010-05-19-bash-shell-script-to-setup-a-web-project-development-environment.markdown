---
layout: post
title: Bash shell script to setup a web project development environment
meta_description: A script to quickly setup a web development environment for a specific project on your local machine that allows you to specify a project skeleton to start the project
meta_keywords: github, shell script, vhost, web server, bash script, setup web development environment, project skeleton
category: ['web-development']
---
My development environment is always my local machine.  Since I was tired of always repeating the same steps to setup a new web project, this script was born (actually I few years ago, but now I'm comfortable enough to publish it). This is also coupled with my project skeletons hosted at github.

## The mksite.sh bash script

{% highlight bash %}
#!/bin/bash
SITE=$1
TYPE=$2

LUSER="favio"
GIT_USERNAME="favrik"
SITES_FOLDER="/home/favio/web"

cd $SITES_FOLDER

if ! test -z "$TYPE" ; then
    su $LUSER -c "git clone git@github.com:$GIT_USERNAME/${TYPE}_project_skeleton.git $SITE"
    rm -fr $SITE/.git
fi

mkdir -p $SITE/public
mkdir -p $SITE/data/logs

chown $LUSER:$LUSER $SITE


function vhost
{
    echo "<VirtualHost *:80>
        ServerAdmin webmaster@$SITE
        ServerName $SITE
        DocumentRoot $SITES_FOLDER/$SITE/public
        <Directory $SITES_FOLDER/$SITE/public>
                Options Indexes FollowSymLinks MultiViews
                AllowOverride All
                Order allow,deny
                allow from all
        </Directory>
        CustomLog $SITES_FOLDER/$SITE/data/logs/apache-access.log combined
        ErrorLog  $SITES_FOLDER/$SITE/data/logs/apache-error.log
        LogLevel warn
        ServerSignature On
</VirtualHost>"

}

echo "127.0.0.1 $SITE" >> /etc/hosts
vhost > /etc/apache2/sites-available/$SITE
a2ensite $SITE
/etc/init.d/apache2 reload

{% endhighlight %}

## So how does this work?
The script takes two parameters: 1) The project name which is used as the hostname for your local web server, and 2) the project type which is an optional parameter; if set, it will attempt to clone a git repository following a naming standard to use it as a project skeleton. If in doubt, check the source!

Since this is run with `sudo`, you need to set a few variables:

{% highlight bash %}
LUSER="favio"  # your linux username (could work on mac too)
GIT_USERNAME="favrik" # your github.com username to fetch skeletons from your repository
SITES_FOLDER="/home/favio/web" # the directory where you put all your web projects
{% endhighlight %}

Call it like:
{% highlight bash %}
$ sudo ./mksite.sh YOUR_PROJECT TYPE
{% endhighlight %}

Hope that helps.


