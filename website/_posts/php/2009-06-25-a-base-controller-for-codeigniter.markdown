---
layout: post
title: A base controller for CodeIgniter
meta_description: An attempt to generalize a base controller in CodeIgniter.
meta_keywords: Controller, CodeIgniter, CI, development, design, oop
category: [php]
---
After creating several small to medium CodeIgniter projects, I have adopted the habit of creating a base controller with the following methods:

{% highlight php %}
<?php
class MY_Controller extends Controller {
    
    private $view = array();

    private $view_path = '';

    public function __construct() {
        parent::__construct();
        $this->init();
    }

    /**
     * Override this method in child controllers to call initialization 
     * routines.
     */
    public function init() {}

    /**
     * Set a view variable.
     *
     * @param string $variable Name of the variable.
     * @param mixed $value Variable value.
     */
    public function set($variable, $value) {
        if (!in_array($variable, array('page_title', 'view'))) {
            $this->view[$variable] = $value;
        }
    }

    /**
     * It sets the view path. Useful to call it on the init() method.
     * Do NOT put a trailing slash.
     *
     * @param string $path The path.
     */
    public function set_view_path($path) {
        $this->view_path = $path;
    }

    /**
     * Renders a view. 
     *
     * @param string $title The page title.
     * @param string $view Filename of the view without extension. It defaults
     *                     to the name of the current controller action.
     * @param boolean $return If true, returns the translated viewg, otherwise
     *                        just renders the view normally.
     */
    public function render($title, $view='', $return=false) {
        $this->view['page_title'] = $title;

        $view = empty($view) ? $this->router->fetch_method() : $view;
        $this->view['view'] = $this->view_path . '/' .$view;

        $this->view['_front']  = $this->view_path;
        $this->view['_action'] = $this->router->fetch_method();
        
        $this->renderme();

        $output = $this->load->view(
            'layout', $this->view, $return
        );

        return $output;
    }

    /**
     * Override this method for custom view initializations that need to be
     * done all the time. Perhaps not as useful as I thought.
     */
    public function renderme() {}

    /**
     * Info discovery method.  It's not that pretty. When inspecting CI objects
     * you can get a lot of recursion. :S
     *
     * @param Object $object The object to be inspected.
     */
    public function inspect($object) {
        $methods = get_class_methods($object);
        $vars    = get_class_vars(get_class($object));
        $ovars   = get_object_vars($object);
        $parent  = get_parent_class($object);

        $output  = 'Parent class: ' . $parent . "\n\n";
        $output .= "Methods:\n";
        $output .= "--------\n";
        foreach ($methods as $method) {
            $meth = new ReflectionMethod(get_class($object), $method);
            $output .= $method . "\n";
            $output .= $meth->__toString();
        }

        $output .= "\nClass Vars:\n";
        $output .= "-----------\n";
        foreach ($vars as $name => $value) {
            $output .= $name . ' = ' . print_r($value, 1) . "\n";
        }

        $output .= "\nObject Vars:\n";
        $output .= "------------\n";
        foreach ($ovars as $name => $value) {
            $output .= $name . ' = ' . print_r($value, 1) . "\n";
        }

        echo '<pre>', $output, '</pre>';
    }
}
{% endhighlight %}

With that out of the way, the benefit I get is an improvement in working with views, and some nice view defaults. Let me elaborate a little. 

Usually, for all projects I will have a main layout file with the following, radically summarized, structure:

{% highlight html %}
<html>
<head>
	<title><?php echo $page_title; ?> :: <?php echo $this->config->item('site_name'); ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
	<link rel="stylesheet" type="text/css" media="all" href="<?php echo base_url(); ?>css/site.css" />
</head>
<body>
<div id="wrap">
    <div id="header">
        <a href="<?php echo base_url(); ?>"><img src="<?php echo base_url(); ?>i/logo.jpg" alt="Logo" /></a>
    </div>
    <?php if ($_front == 'admin'): ?>
        <?php echo $this->load->view('admin/menu'); ?>
    <?php endif; ?>
    <div id="content">
        <?php $this->load->view($view); ?>
    </div>
    <div id="footer">
        <img src="<?php echo base_url(); ?>i/footer.gif" alt="" />
    </div>
</div>
</body>
</html>
{% endhighlight %}

You can see in the code pasted above, that I made the assumption that if using this controller, you will have a similar layout file called "layout.php" in the application/views directory.

By making this assumption, I can now render templates, and use child controllers in the following way:

{% highlight php %}
<?php

class Test extends MY_Controller {

    public function init() {
        /* Load authentication? Start sessions? */

        /* Setting the view path could be useful for specific controllers */
        $this->set_view_path('admin'); // application/views/admin/
    }

    public function index() {
        /* Assumes the template application/views/index.php exists */
        $this->render('My Home Page');
    }

    public function another() {
        /* Renders the template application/views/test.php */
        $this->render('Another', 'test');
    }

    public function moretest() {
        /* Setting a view variable */
        $this->set('greeting', 'Hello there');
    }
}

{% endhighlight %}

Basically, the most interesting method here is <code>render()</code>. You can <a href="/downloads/MY_Controller.txt">download the source</a> as a text file. ^_^
