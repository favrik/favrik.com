---
layout: post
title: Upgrade headaches from Rails 2.3.5 to 3.0.5
meta_description: Issues I encountered when upgrading from Ruby On Rails 2.3.5 to 3.0.5
meta_keywords: RoR, Rails 3, Ruby On Rails 3, upgrade Rails
category: [ruby]
---

## Upgrade!

The guide is at [Upgrading to Rails 3](http://railscasts.com/episodes/225-upgrading-to-rails-3-part-1). An excellent guide. :)

After a successful initial upgrade, you have to fix the compatibility and deprecation issues.


* * *


## Unobtrusive Javascript

If you are using jQuery as your UJS adapter, make sure you are using jQuery >= 1.4.3, since that's when they started adding data-attributes to the data object. 


* * *


## Change <code>form_remote_tag</code> to <code>form_tag</code> or <code>form_for</code>, etc.

### Previously on Rails 2
{% highlight ruby %}
<% form_remote_tag  
    :url => {:controller=>'user_sessions',:action =>'ajax_login'},
    :before => %(Element.show('spinner')), 
    :update =>'search_result',
    :success => %(Element.hide('spinner')) do  %>
{% endhighlight %}

### Now on Rails 3

{% highlight ruby %}
<% form_tag  
    url_for({:controller=>'user_sessions',:action =>'ajax_login'}),
    :id => 'loginForm' do  %>
{% endhighlight %}

However, that also means that you are in charge of handling the AJAX events like:

{% highlight javascript %}
// jQuery
$(function () {

    var ajaxLoading = function () { $('#spinner').toggle(); };

    $('#loginForm')
        .bind('ajax:loading',  ajaxLoading)
        .bind('ajax:complete', ajaxLoading)
        .bind('ajax:success', function (data, stat, xhr) { $('#search_result').append(data); });

});
{% endhighlight %}

Very opportune article: [Unobtrusive JavaScript in Rails 3](http://www.simonecarletti.com/blog/2010/06/unobtrusive-javascript-in-rails-3/).

Soon or sooner, it will become obvious that a re-usable library for handling these events should be created, or obtained.

* * *

## rake not working

{% highlight bash %}
favio@jujika:~/web/ruby3/ > rake -T --trace
(in /home/favio/web/ruby3)
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/xml-magic-0.1.1/lib/common_thread/xml/xml_magic.rb:5: warning: undefining `object_id' may cause serious problems
DEPRECATION WARNING: Rake tasks in /home/favio/web/ruby3/vendor/plugins/has_many_friends/tasks/has_many_friends_tasks.rake are deprecated. Use lib/tasks instead. (called from <top (required)> at /home/favio/web/ruby3/Rakefile:7)
DEPRECATION WARNING: Rake tasks in /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/db_migrate_merge.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/db_translate.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/git.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/lazy_developer_tasks.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/nuke.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/rcov.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/rspec.rake, /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/svn.rake, and /home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/test_unit.rake are deprecated. Use lib/tasks instead. (called from <top (required)> at /home/favio/web/ruby3/Rakefile:7)
rake aborted!
no such file to load -- activerecord
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:239:in `require'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:239:in `block in require'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:225:in `block in load_dependency'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:596:in `new_constants_in'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:225:in `load_dependency'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:239:in `require'
/home/favio/web/ruby3/vendor/plugins/lazy_developer/tasks/db_translate.rake:2:in `<top (required)>'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:235:in `load'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:235:in `block in load'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:225:in `block in load_dependency'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:596:in `new_constants_in'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:225:in `load_dependency'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/activesupport-3.0.5.rc1/lib/active_support/dependencies.rb:235:in `load'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/plugin.rb:51:in `block in load_deprecated_tasks'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/plugin.rb:51:in `each'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/plugin.rb:51:in `load_deprecated_tasks'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/plugin.rb:44:in `load_tasks'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/application.rb:140:in `block in load_tasks'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/application/railties.rb:11:in `each'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/application/railties.rb:11:in `all'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/application.rb:140:in `load_tasks'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/railties-3.0.5.rc1/lib/rails/application.rb:77:in `method_missing'
/home/favio/web/ruby3/Rakefile:7:in `<top (required)>'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2383:in `load'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2383:in `raw_load_rakefile'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2017:in `block in load_rakefile'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2068:in `standard_exception_handling'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2016:in `load_rakefile'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2000:in `block in run'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:2068:in `standard_exception_handling'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/lib/rake.rb:1998:in `run'
/home/favio/.rvm/gems/ruby-1.9.2-p180/gems/rake-0.8.7/bin/rake:31:in `<top (required)>'
/home/favio/.rvm/gems/ruby-1.9.2-p180/bin/rake:19:in `load'
/home/favio/.rvm/gems/ruby-1.9.2-p180/bin/rake:19:in `<main>'

{% endhighlight %}

This was problem with the lazy_developer plugin.  Updating the plugin solves the issue, but notice how the offending error is kind of "hidden" in rake's output.


* * *

## Scoped methods

This no longer works with Rails 3:

{% highlight ruby %}

self.friends.scoped(:conditions => {'friendships.status' => 1})

{% endhighlight %}

This is the work around I've used:

{% highlight ruby %}

friends = self.friends.scoped
friends.where(:status => 1)

{% endhighlight %}

or without using scopes:

{% highlight ruby %}

class Friends < ActiveRecord::Base
  
  class << self
    def active_friends
      where(:status => true)
    end
  end

end

self.friends.active_friends

{% endhighlight %}


* * *

## Database Migrations

Error I got:

{% highlight bash %}
rake aborted!
/home/favio/web/ruby3/db/migrate/20100507120617_garbs_wears.rb:3: syntax error, unexpected ',', expecting ')'
  create_table (:garbs_wears ,:id =>false)do |t|
                              ^
/home/favio/web/ruby3/db/migrate/20100507120617_garbs_wears.rb:4: syntax error, unexpected tSYMBEG, expecting keyword_end
      t.string     :garb_id
                    ^
/home/favio/web/ruby3/db/migrate/20100507120617_garbs_wears.rb:12: syntax error, unexpected keyword_end, expecting $end
{% endhighlight %}


It seems the database migration syntax changed a bit:

Old way in Rails 2:

{% highlight ruby %}
class GarbsWears < ActiveRecord::Migration
  def self.up
  create_table (:garbs_wears ,:id =>false) do |t|
      t.string     :garb_id
      t.integer    :wear_id
      t.timestamps
      end
  end

  def self.down
  end
end
{% endhighlight %}


Now, in Rails 3:

{% highlight ruby %}
class GarbsWears < ActiveRecord::Migration
  def self.up
  create_table :garbs_wears, :id => false do |t|
      t.string     :garb_id
      t.integer    :wear_id
      t.timestamps
      end
  end

  def self.down
  end
end

{% endhighlight %}

Note the lack of parenthesis.

* * *

## Closing

Those have been my little headaches when doing an upgrade from Rails 2 to 3. But totally worth it as I had to learn RoR while doing the upgrade.  I didn't cover any topics related to using specific gems (like facebooker) and their status in Rails 3.

What have been your worst or little headaches when upgrading Rails?
