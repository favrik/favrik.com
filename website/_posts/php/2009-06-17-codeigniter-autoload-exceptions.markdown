---
layout: post
title: CodeIgniter autoload exceptions
meta_description: Exceptions are the rule in programming, so what happens when you need to NOT autoload libraries in a specific controller.
meta_keywords: CodeIgniter, CI, autoload
category: [php]
---
CodeIgniter's <a href="http://codeigniter.com/user_guide/general/autoloader.html">autoload feature</a> is really nice for avoiding the boring task of loading common libraries (for example: database, session, or a custom library). But what happens when you need to avoid autoloading some libraries in a specific controller?

I googled for a bit, before reading the source.  So here's a way of NOT autoloading libraries in specific controllers: just overwrite the <code>_ci_initialize()</code> method to look like this:

{% highlight php %}
<?php
    /*
        The only difference is that calls to _ci_autoloader() were removed.
     */
	function _ci_initialize()
	{
		// Assign all the class objects that were instantiated by the
		// front controller to local class variables so that CI can be
		// run as one big super object.
		$classes = array(
							'config'	=> 'Config',
							'input'		=> 'Input',
							'benchmark'	=> 'Benchmark',
							'uri'		=> 'URI',
							'output'	=> 'Output',
							'lang'		=> 'Language',
							'router'	=> 'Router'
							);
		
		foreach ($classes as $var => $class)
		{
			$this->$var =& load_class($class);
		}

		// In PHP 5 the Loader class is run as a discreet
		// class.  In PHP 4 it extends the Controller
		if (floor(phpversion()) >= 5)
		{
			$this->load =& load_class('Loader');
		}
		else
		{
			// sync up the objects since PHP4 was working from a copy
			foreach (array_keys(get_object_vars($this)) as $attribute)
			{
				if (is_object($this->$attribute))
				{
					$this->load->$attribute =& $this->$attribute;
				}
			}
		}
	}
?>
{% endhighlight %}

You could also create a special Controller and extend from it to avoid repeating code.  Why would you ever want to do this?  Think about calling a CI controller and action from a cron job.  Or an optimized version of any page that really does not need sessions nor authentication to be loaded.

I'm putting this out there not because it's a clever solution (it is not), but to hopefully save some time searching for that non-existent option to disable autoload for some controllers; at least I couldn't find it :(.  So please let me know if that exists.

