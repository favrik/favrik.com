--- 
wordpress_id: 51
layout: post
title: ejabberd doesn't run after apt-get install ejabberd
wordpress_url: http://blog.favrik.com/?p=51
category: [xmpp]
---
This is on Ubuntu.  Edit /etc/ejabberd/ejabberd.cfg and make sure that the host in:
[code]
%% Admin user
{acl, admin, {user, "nemo", "ns-interns02"}}.

%% Hostname
{hosts, ["ns-interns02"]}.
[/code]
is a valid DNS name.  I didn't try with with the default value of <em>localhost</em>.
